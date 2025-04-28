/**
 * @jest-environment node
 */

// Import application modules directly to include them in code coverage
const app = require('../app');
const [indexRouter, usersRouter, caseRouter, queryRouter] = 
  [require('../routes/index'), require('../routes/users'), 
   require('../routes/caseChooser'), require('../routes/query')];
const createError = require('http-errors');

// Mock helpers
const mockRequest = () => ({
  body: {}, params: {}, query: {},
  app: { get: jest.fn().mockReturnValue('development') }
});

const mockResponse = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  render: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
  locals: {}
});

// Mock http-errors
jest.mock('http-errors', () => jest.fn(status => ({ status, message: 'Not Found' })));

// Mock LLM dependencies for routes/query.js tests
jest.mock('@langchain/community/vectorstores/chroma', () => ({
  Chroma: jest.fn().mockImplementation(() => ({
    similaritySearchVectorWithScore: jest.fn().mockResolvedValue([
      [{ pageContent: 'Test content 1' }], [{ pageContent: 'Test content 2' }]
    ])
  }))
}));

jest.mock('@langchain/community/embeddings/huggingface_transformers', () => ({
  HuggingFaceTransformersEmbeddings: jest.fn().mockImplementation(() => ({
    embedQuery: jest.fn().mockResolvedValue([0.1, 0.2, 0.3])
  }))
}));

jest.mock('@langchain/ollama', () => ({
  ChatOllama: jest.fn().mockImplementation(() => ({
    invoke: jest.fn().mockResolvedValue({ content: 'Test response' })
  }))
}));

describe('App', () => {
  // Helper to find middleware in Express stack
  const findMiddleware = name => app._router.stack.find(
    layer => !layer.route && (layer.name === name || (name === 'anonymous' && !layer.name))
  );
  
  test('app structure', () => {
    // App components
    expect(app).toBeDefined();
    expect(typeof app).toBe('function');
    expect(app.get).toBeDefined();
    expect(app.post).toBeDefined();
    expect(app.use).toBeDefined();
    
    // View engine
    expect(app.get('views')).toContain('views');
    expect(app.get('view engine')).toBe('jade');
    
    // Router usage
    const routes = ['/', '/users', '/choose-case', '/query'];
    routes.forEach(route => expect(app._router.stack.some(
      layer => layer.name === 'router' && layer.regexp.test(route)
    )).toBeTruthy());
    
    // Middleware
    const names = app._router.stack.map(layer => layer.name);
    ['query', 'expressInit', 'jsonParser', 'cookieParser', 'serveStatic', 'router']
      .forEach(name => expect(names).toContain(name));
  });
  
  test('error handlers', () => {
    // 404 handler
    const [req404, res404, next404] = [mockRequest(), mockResponse(), jest.fn()];
    const notFoundHandler = findMiddleware('anonymous');
    if (notFoundHandler) {
      notFoundHandler.handle(req404, res404, next404);
      expect(next404).toHaveBeenCalled();
      expect(createError).toHaveBeenCalledWith(404);
    }
    
    // Main error handler with different scenarios
    const errorHandler = findMiddleware('errorHandler');
    if (!errorHandler) return;
    
    [
      { error: { status: 500, message: 'Server error', stack: 'Error\n at line 1' }, 
        env: 'development', expectStatus: 500, expectStack: true },
      { error: { status: 500, message: 'Simple error' }, env: 'development', expectStatus: 500 },
      { error: { status: 500, message: 'Sensitive error', sensitiveData: 'secret' }, 
        env: 'production', expectStatus: 500, expectEmpty: true },
      { error: { status: 418, message: 'I\'m a teapot' }, env: 'development', expectStatus: 418 },
      { error: { message: 'No status' }, env: 'development', expectStatus: 500 }
    ].forEach(tc => {
      const reqErr = mockRequest();
      reqErr.app.get.mockReturnValue(tc.env);
      const resErr = mockResponse();
      
      errorHandler.handle(tc.error, reqErr, resErr, jest.fn());
      
      expect(resErr.status).toHaveBeenCalledWith(tc.expectStatus);
      expect(resErr.render).toHaveBeenCalledWith('error');
      expect(resErr.locals.message).toBe(tc.error.message);
      
      if (tc.env === 'development') expect(resErr.locals.error).toEqual(tc.error);
      else expect(resErr.locals.error).toEqual({});
      
      if (tc.expectStack) expect(resErr.locals.error.stack).toBeDefined();
      if (tc.env === 'production' && tc.error.sensitiveData) 
        expect(resErr.locals.error.sensitiveData).toBeUndefined();
    });
  });
  
  test('routes initialization', () => {
    // Check router initialization
    [indexRouter, usersRouter, caseRouter, queryRouter].forEach(router => {
      expect(router).toBeDefined();
      expect(router.get).toBeDefined();
      expect(router.post).toBeDefined();
    });
    
    // Test route handlers
    const getHomeRoute = indexRouter.stack.find(l => 
      l.route && l.route.path === '/' && l.route.methods.get);
    expect(getHomeRoute).toBeDefined();
    const [reqHome, resHome] = [mockRequest(), mockResponse()];
    getHomeRoute.route.stack[0].handle(reqHome, resHome, jest.fn());
    expect(resHome.render).toHaveBeenCalledWith('index', expect.any(Object));
    
    // Users route
    const getUsersRoute = usersRouter.stack.find(l => 
      l.route && l.route.path === '/' && l.route.methods.get);
    if (getUsersRoute) {
      const [reqUsers, resUsers] = [mockRequest(), mockResponse()];
      getUsersRoute.route.stack[0].handle(reqUsers, resUsers, jest.fn());
      expect(resUsers.send).toHaveBeenCalled();
    }
    
    // Case route
    const getCaseRoute = caseRouter.stack.find(l => 
      l.route && l.route.path === '/' && l.route.methods.get);
    if (getCaseRoute) {
      const [reqCase, resCase] = [mockRequest(), mockResponse()];
      getCaseRoute.route.stack[0].handle(reqCase, resCase, jest.fn());
      expect(resCase.render).toHaveBeenCalled();
    }
  });
}); 