/**
 
@jest-environment node*/

const caseChooserRouter = require('../routes/caseChooser');

// Mock Express response and request objects
const mockRequest = () => {
  const req = {};
  req.body = {};
  req.params = {};
  req.query = {};
  return req;
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe('Case Chooser Router Tests', () => {
  test('caseChooserRouter should be an express router', () => {
    expect(caseChooserRouter).toBeDefined();
    expect(caseChooserRouter.get).toBeDefined();
    expect(caseChooserRouter.post).toBeDefined();
    expect(caseChooserRouter.stack).toBeDefined();
    expect(Array.isArray(caseChooserRouter.stack)).toBe(true);
  });

  test('POST / should return a case object', () => {
    // Find the route handler for POST /
    const postCaseRoute = caseChooserRouter.stack.find(layer => 
      layer.route && layer.route.path === '/' && layer.route.methods.post
    );

    expect(postCaseRoute).toBeDefined();

    // Call the handler function with mock req/res
    const req = mockRequest();
    const res = mockResponse();

    postCaseRoute.route.stack[0].handle(req, res);

    // Verify that res.json was called with the expected object
    expect(res.json).toHaveBeenCalledWith({"case": "Case_1"});
  });

  test('selectCollectionName function returns "Case_1"', () => {
    // Directly test the selectCollectionName function by accessing it from the module
    const selectCollectionName = caseChooserRouter.routes.selectCollectionName;
    expect(selectCollectionName).toBeDefined();
    expect(selectCollectionName()).toBe("Case_1");
  });
});