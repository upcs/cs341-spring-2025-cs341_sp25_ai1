// store cases in an array
const db = {
    cases: [],
    
    async init() {
        // Case 1: Original case
        this.cases.push({
            title: "Necrotic acalculous cholecystitis",
            symptoms: [
                "acute abdominal pain",
                "vomiting",
                "fecal retention",
                "pale skin",
                "elevated heart rate",
                "decreased bowel sounds",
                "diffuse tenderness",
                "reduced general condition"
            ],
            presentation: "8-year-old boy presented with acute abdominal pain, general feeling of illness, intermittent vomiting for 3 days, diffuse abdominal pain, fecal retention, reduced general condition, pale skin, heart rate of 102/minute, decreased bowel sounds, and diffuse tenderness throughout the abdomen."
        });

        // Case 2: Isotretinoin-induced pancreatitis
        this.cases.push({
            title: "Isotretinoin-induced pancreatitis",
            symptoms: [
                "acute abdominal pain",
                "general feeling of illness",
                "intermittent vomiting",
                "diffuse abdominal tenderness",
                "fecal retention",
                "apathetic condition"
            ],
            presentation: "20-year-old man presented with transfixing abdominal pain, preceded by general feeling of illness and intermittent vomiting for 3 days. Patient showed markedly reduced general condition with pale skin and appeared apathetic."
        });

        // Case 3: Multiple evanescent white dot syndrome
        this.cases.push({
            title: "Multiple evanescent white dot syndrome",
            symptoms: [
                "ocular pain",
                "visual field defect",
                "blind spot enlargement",
                "reduced vision",
                "photopsias",
                "subjective scotomas"
            ],
            presentation: "23-year-old woman presented with ocular pain and visual field defect in her left eye for 1 week. Visual acuity was reduced to 20/30 in the left eye, with blind spot enlargement and disc swelling."
        });

        // Case 4: SELENON-related myopathy
        this.cases.push({
            title: "SELENON-related myopathy",
            symptoms: [
                "respiratory difficulty",
                "muscle weakness",
                "early muscle exhaustion",
                "fatigue",
                "difficulty climbing steps",
                "slow running",
                "waddling gait"
            ],
            presentation: "44-year-old woman presented with acute respiratory failure requiring intubation. History revealed long-standing slight motor limitations including slow running, difficulty climbing high steps, early muscle exhaustion, and fatigue."
        });

        // Case 5: Pressure ulcer with Taurolidine treatment
        this.cases.push({
            title: "Deep pressure ulcer",
            symptoms: [
                "painful wound",
                "drainage from wound",
                "redness",
                "swelling",
                "foul-smelling discharge",
                "exposed bone",
                "tissue damage"
            ],
            presentation: "17-year-old male with paraplegia presented with a painful wound over the ischium/os coccygeus region, showing drainage, redness, swelling, and foul-smelling discharge. The ulcer measured 10 cm × 8 cm with exposed bone."
        });

        // Case 6: Pernicious anemia
        this.cases.push({
            title: "Pernicious anemia",
            symptoms: [
                "lower limb weakness",
                "macrocytic anemia",
                "fatigue",
                "dizziness",
                "paresthesia",
                "imbalance"
            ],
            presentation: "51-year-old man presented with recurrent lower limb weakness for about 2 months. Initial blood counts revealed macrocytic anemia. Diagnosis of pernicious anemia was confirmed through serum cobalamin levels and intrinsic factor autoantibodies."
        });

        // Case 7: Inflammatory pseudotumor of the spleen
        this.cases.push({
            title: "Inflammatory pseudotumor of the spleen",
            symptoms: [
                "abdominal pain",
                "bloating",
                "anemia",
                "fatigue",
                "weight loss"
            ],
            presentation: "63-year-old man presented with abdominal pain and was found to have a splenic inflammatory pseudotumor. Underwent laparoscopic splenectomy and was found to have a concurrent invasive lepidic adenocarcinoma of the lung."
        });

        // Case 8: Ascariasis causing small bowel obstruction
        this.cases.push({
            title: "Ascariasis causing small bowel obstruction",
            symptoms: [
                "vomiting",
                "abdominal pain",
                "distension",
                "inability to pass stool or gas"
            ],
            presentation: "8-year-old boy presented with a 3-day history of vomiting and abdominal pain. Ultrasound confirmed a small bowel obstruction caused by a bolus of Ascaris lumbricoides, which was successfully removed by surgical intervention."
        });

        // Case 9: Methicillin-resistant Staphylococcus epidermidis knee prosthetic infection
        this.cases.push({
            title: "MRSE knee prosthetic infection",
            symptoms: [
                "knee pain",
                "functional limitation",
                "swelling",
                "fever"
            ],
            presentation: "31-year-old woman with a history of knee arthroplasty presented with knee pain and swelling. Diagnosed with MRSE infection and treated with a two-stage revision and combination therapy of fosfomycin and rifampin."
        });

        // Case 10: Refractory hypercalcemia from PTHrP-secreting tumor
        this.cases.push({
            title: "Refractory hypercalcemia from PTHrP-secreting tumor",
            symptoms: [
                "severe hypercalcemia",
                "abdominal pain",
                "fatigue",
                "weakness",
                "nausea",
                "weight loss"
            ],
            presentation: "53-year-old man presented with severe hypercalcemia refractory to treatment. CT scan revealed pancreatic lesion and multiple hepatic metastases. Diagnosed with metastatic pancreatic neuroendocrine tumor secreting parathyroid-hormone-related peptide."
        });

        // Case 11: Congenital vitamin D deficiency
        this.cases.push({
            title: "Congenital vitamin D deficiency",
            symptoms: [
                "feeding difficulties",
                "frequent apnea",
                "cyanosis",
                "hoarseness",
                "gagging",
                "respiratory distress",
                "poor weight gain"
            ],
            presentation: "50-day-old infant presented with worsening respiratory symptoms including rapid breathing, cough, recurrent brief episodes of apnea, hoarseness and frequent gagging. Had persistent feeding difficulties and poor weight gain since birth."
        });

        // Case 12: Idiopathic iliac artery aneurysm
        this.cases.push({
            title: "Idiopathic iliac artery aneurysm", 
            symptoms: [
                "abdominal pain",
                "functional limitation",
                "discomfort",
                "swelling"
            ],
            presentation: "11-year-old boy presented with severe abdominal pain for 2 months. CT scan identified a 4cm x 4cm aneurysm of the left internal iliac artery requiring surgical intervention."
        });

        // Case 13: Kümmell's disease
        this.cases.push({
            title: "Kümmell's disease",
            symptoms: [
                "persistent back pain",
                "kyphosis", 
                "limited mobility",
                "tenderness",
                "weakness"
            ],
            presentation: "67-year-old woman presented with persistent back pain and weakness lasting nearly 2 months. Pain worsened when walking or changing positions. Had history of minor fall one year prior. Imaging showed T12 vertebral wedge deformity with kyphosis."
        });

        // Case 14: Painless esophageal rupture
        this.cases.push({
            title: "Painless esophageal rupture",
            symptoms: [
                "neck swelling",
                "crackling sensation",
                "mild chest discomfort",
                "surgical emphysema",
                "tachycardia",
                "tachypnea"
            ],
            presentation: "24-year-old Eastern European primigravida presented with neck swelling and crackling sensation after delivery. Patient was clinically stable with mild tachycardia, tachypnea, and oxygen saturations of 99% on room air. Surgical emphysema was palpable in chest, neck and face areas."
        });

        // Case 15: Fecaloma causing small bowel obstruction
        this.cases.push({
            title: "Fecaloma causing small bowel obstruction",
            symptoms: [
                "abdominal pain",
                "vomiting",
                "inability to pass feces",
                "chronic constipation"
            ],
            presentation: "60-year-old Middle Eastern female presented with abdominal pain, vomiting, and inability to pass feces. Had 1-year history of chronic constipation. CT imaging revealed narrowing transitional zone of jejunal loops with semifecal content suggesting mechanical obstruction."
        });

        // Case 16: Bilobed distal tibia
        this.cases.push({
            title: "Bilobed distal tibia",
            symptoms: [
                "limping",
                "pain",
                "leg deformity",
                "distal leg widening",
                "bone prominence",
                "limited ankle motion",
                "flatfoot"
            ],
            presentation: "5-year-old Iranian girl presented with limping and pain in right lower limb. Examination showed distal leg widening, bone prominence in medial supramalleolar area, deformity in first ray, hindfoot varus, and flatfoot. Ankle joint showed limitation in range of motion."
        });

        // Case 17: Bilateral congenital cataract with developmental delay
        this.cases.push({
            title: "Bilateral congenital cataract with developmental delay",
            symptoms: [
                "bilateral cataracts",
                "failure to thrive",
                "developmental delay",
                "speech delay",
                "microcephaly",
                "small anterior fontanelle"
            ],
            presentation: "3.5-year-old Indian male presented with bilateral cataracts, failure to thrive, and developmental delay. Had normal motor development but significant speech delay. Clinical examination showed microcephaly and small anterior fontanelle with prominent metopic suture."
        });
    },

    getRandomCase() {
        const randomIndex = Math.floor(Math.random() * this.cases.length);
        return this.cases[randomIndex];
    }
};

// Initialize the database
db.init();

module.exports = { db };