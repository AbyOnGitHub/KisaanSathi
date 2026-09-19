-- Create the table for disease descriptions
CREATE TABLE public.disease_descriptions (
  id SERIAL PRIMARY KEY,
  disease_name TEXT UNIQUE NOT NULL,
  crop_type TEXT NOT NULL,
  description TEXT NOT NULL,
  symptoms TEXT NOT NULL,
  organic_treatment TEXT,
  chemical_treatment TEXT
);

-- Enable RLS
ALTER TABLE public.disease_descriptions ENABLE ROW LEVEL SECURITY;

-- Anyone can read disease descriptions
CREATE POLICY "Anyone can view disease descriptions"
ON public.disease_descriptions FOR SELECT
USING (true);

-- Only admins can modify (insert/update/delete)
CREATE POLICY "Admins can modify disease descriptions"
ON public.disease_descriptions FOR ALL
USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' )
WITH CHECK ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );

-- Seed the 11 classes for the ResNet50 model
INSERT INTO public.disease_descriptions (disease_name, crop_type, description, symptoms, organic_treatment, chemical_treatment) VALUES
('Corn___Cercospora_leaf_spot Gray_leaf_spot', 'Corn', 'A fungal disease affecting corn leaves, reducing photosynthetic area and yield.', 'Tan, rectangular lesions on leaves restricted by leaf veins.', 'Crop rotation, removing crop debris, planting resistant varieties.', 'Apply fungicides containing pyraclostrobin or azoxystrobin when lesions first appear. Follow safety guidelines.'),
('Corn___Common_rust', 'Corn', 'A fungal disease causing rust-like pustules on corn leaves.', 'Small, circular, reddish-brown pustules on both upper and lower leaf surfaces.', 'Plant rust-resistant hybrids. Avoid late planting.', 'Fungicides like tebuconazole or propiconazole can be effective if applied early.'),
('Corn___Northern_Leaf_Blight', 'Corn', 'A fungal disease prevalent in humid conditions that causes large necrotic lesions.', 'Large, cigar-shaped, grayish-green to tan lesions on leaves.', 'Tillage to bury residue, crop rotation, and resistant hybrids.', 'Foliar fungicides (e.g., mancozeb) applied before tasseling can manage the disease.'),
('Corn___healthy', 'Corn', 'The corn plant appears healthy with no signs of disease.', 'Green, vibrant leaves with no lesions, spots, or discoloration.', 'Maintain good agricultural practices: proper watering, fertilization, and weed control.', 'None required. Continue standard preventative care.'),
('Potato___Early_blight', 'Potato', 'A common fungal disease of potatoes causing defoliation and yield loss.', 'Brown or black spots on older leaves, often with concentric rings (target board appearance).', 'Provide adequate nitrogen, ensure good air circulation, and practice crop rotation.', 'Apply fungicides like chlorothalonil or mancozeb as a preventative measure. Wear protective gear.'),
('Potato___Late_blight', 'Potato', 'A devastating water mold disease that caused the Irish Potato Famine.', 'Water-soaked spots on leaves that rapidly turn brown/black, often with a white fuzzy growth on the underside.', 'Destroy infected plants immediately, improve drainage, use certified disease-free seed.', 'Fungicides containing metalaxyl or copper-based sprays. High risk: Consult agricultural officer before use.'),
('Potato___healthy', 'Potato', 'The potato plant appears healthy with no visible signs of infection.', 'Leaves are uniformly green, stems are robust, and no blight spots are present.', 'Maintain consistent watering and balanced fertilization.', 'None required.'),
('Tomato___Bacterial_spot', 'Tomato', 'A bacterial disease causing spots on leaves, stems, and fruits.', 'Small, dark, water-soaked spots on leaves; scabby spots on fruit.', 'Avoid overhead watering, use drip irrigation, sanitize tools, and remove infected plant debris.', 'Copper-based bactericides can help reduce the spread but will not cure infected plants.'),
('Tomato___Early_blight', 'Tomato', 'A fungal disease that primarily affects older foliage and stems.', 'Dark, irregular spots with concentric rings on lower leaves, leading to yellowing and leaf drop.', 'Prune lower leaves to improve air circulation, mulch to prevent soil splashing, practice rotation.', 'Fungicides like chlorothalonil or copper soap applied early in the season.'),
('Tomato___Late_blight', 'Tomato', 'A highly destructive disease caused by Phytophthora infestans affecting tomatoes and potatoes.', 'Irregular, water-soaked lesions on leaves and stems; firm, dark brown patches on fruit.', 'Ensure good airflow, avoid overhead watering, remove and destroy infected plants immediately.', 'Fungicides such as chlorothalonil or mancozeb. Apply preventatively during cool, wet weather.'),
('Tomato___healthy', 'Tomato', 'The tomato plant is healthy and free from diseases.', 'Vibrant green leaves, strong stems, and unblemished fruits.', 'Continue routine care including proper pruning, watering, and feeding.', 'None required.')
ON CONFLICT (disease_name) DO NOTHING;
