# Software Requirements Specification for Unified AI-Based Farmer Portal (KisaanSathi)

**Version 1.0 approved**
**Prepared by** Abedan Biswal, Faaeq Sayed, Uday Mahajan, Hakim Sheikh
*Copyright © 1999 by Karl E. Wiegers. Permission is granted to use, modify, and distribute this document.*

---

## Revision History

| Name | Date | Reason For Changes | Version |
|------|------|--------------------|---------|
|      |      |                    |         |
|      |      |                    |         |
|      |      |                    |         |

## 1. Introduction

### 1.1 Purpose  
India’s has a huge population of 1.47 billion people living in the country out of which around 240 million are occupied in agriculture. Moreover, agriculture contributed to 18.2% of the Indian economy. While farmers are the backbone of the nation, our research aims to ease some of their struggle with modern AI and Web-based solutions. Majority issues in this domain revolve around pest and crop disease prediction, yield prediction, supply chain problems and fluctuating market prices. The Indian government also has direct benefit transfer (DBT) schemes for farmers, but not many farmers are aware of according to a research 18-67% of farmers do not utilize existing schemes because of unclear scheme delivery procedure or confusion about eligibility. We propose a unified portal, which provides services like DBT schemes recommendation system, Crop disease detection tool using Image Processing, Yield prediction for crop and Marketplace interface. 

### 1.2 Document Conventions 
1. **Requirement Identifiers:** Every specific functional and non-functional requirement is assigned a unique tracking identifier format: `REQ-[Section Number].[Requirement Number]` (e.g., REQ-3.1.2). This allows for precise traceability during the development, testing, and quality assurance phases.
2. **Priority Inheritance:** Higher-level system features (detailed in Section 3) are assigned an overall priority level (e.g., High, Medium-High, Low). Unless otherwise specified, all detailed sub-requirements listed under that feature inherit the parent feature's priority level. If a specific sub-requirement deviates from the parent's priority, it will be explicitly stated alongside its identifier.
3. **Typographical Standards:**
   - **Bold Text:** Used to emphasize primary user classes (e.g., Farmer, Dealer, Administrator), exact UI button labels (e.g., "Check Crop Health"), and priority levels.
   - *Italic Text:* Used when referring to external documents, regulatory acts (e.g., DPDP Act), or defining a scenario/use case.
   - `Monospace Font`: Used exclusively to denote technical stack components, code snippets, algorithms, database entities, and API endpoints (e.g., FastAPI, ResNet50, User_Farmer, `<input type="file">`).
4. **Modal Verbs (RFC 2119 Standard):** This document adopts standard engineering modal verbs to indicate the strictness of a requirement:
   - **SHALL / MUST:** Indicates an absolute, non-negotiable requirement of the system (e.g., "The system SHALL encrypt all data in transit").
   - **SHOULD:** Indicates a highly recommended feature that can be bypassed if valid technical or business reasons exist, though implications must be understood.
   - **MAY:** Indicates an optional feature or a future enhancement that does not affect the core functionality of the Minimum Viable Product (MVP).
5. **Language and Translation:** While the end product is mandated to support multiple Indian regional languages, this SRS document is authored entirely in standard Technical English. Any regional agricultural terms used for context (e.g., Kharif, Rabi, Mandi) are defined in Appendix A: Glossary.

### 1.3 Intended Audience and Reading Suggestions 
This document is intended to target primarily developers who are involved in the development of this product and also the ones who wish to understand and contribute in the future. Since the target market is the agriculture field, agricultural analysts and business managers can also draw insights from this document to evaluate feasibility of this product. 

### 1.4 Product Scope 
The following solution is a Web-based portal accessible through any browser. The product will leverage real-time market price values, farmer scheme data and reference to actual government websites to provide future proof services. It will require access to a camera if taking real time pictures for crop disease detection is required. 

### 1.5 References 
- **Technical Documentation and Frameworks**
- FastAPI Documentation: Specifications for building asynchronous, high-performance RESTful APIs in Python.
- Scikit-Learn API Reference: Algorithmic documentation for implementing the machine learning classification and regression models 
- Deep Learning Architectures Reference: Original research papers and framework documentation (e.g., TensorFlow/PyTorch) for the implementation of EfficientNet and ResNet50 models used in the image processing workflows.
- PostgreSQL / Supabase Documentation: Guidelines for relational database schema design, connection pooling, and implementing Row Level Security (RLS) for marketplace data isolation.

## 2. Overall Description 

### 2.1 Product Perspective 
At present there exist products with services like checking market prices, crop disease detection etc. However, the market lacks an easy-to-use unified web-based platform, which brings solutions to some major problems under one roof. Hence, the mentioned product in this SRS (KisaanSathi) is an independent system. 

### 2.2 Product Functions 
- Users will be able to make personal profiles with their farm information, sowing type, income, etc. 
- Based on their personal information one can get personalized suggestion for eligible schemes available.
- A market place for farmers to contact raw material dealers and negotiate prices before making purchase through the portal. 
- Crop disease detection can be easily done by simply uploading a picture of the affected crop. Results will provide treatment guidelines and preventive measure. 

### 2.3 User Classes and Characteristics 
1. **Farmers / Agricultural Producers:** As the core focus of the portal, this class dictates the primary design and accessibility constraints of the system.
   - **Frequency of Use:** High, particularly during pre-sowing, active growth, and harvesting seasons.
   - **Subset of Functions Used:** DBT Scheme Recommendation, Crop Disease Detection (uploading images), Yield Prediction, and the Marketplace (as buyers of raw materials).
   - **Technical Expertise:** Generally low to moderate. They may not be highly computer-literate but are usually familiar with basic smartphone usage.
   - **Pertinent Characteristics:** Highly dependent on the regional language support requirement. Require an intuitive, visually driven user interface with minimal text input. Likely to access the web application via mobile devices on varying network bandwidths (3G/4G). May require clear, step-by-step guidance to understand DBT scheme eligibility and application procedures.
2. **Raw Material Dealers / Suppliers:** These users are essential for the marketplace interface to function effectively, providing the supply side of the equation.
   - **Frequency of Use:** Moderate to High, checking for inquiries and negotiating with potential buyers.
   - **Subset of Functions Used:** Marketplace Interface (listing products, managing inventory, responding to farmer queries, and negotiating prices).
   - **Technical Expertise:** Moderate. Usually comfortable with standard e-commerce platforms, messaging apps, and web portals.
   - **Pertinent Characteristics:** Motivated by business growth and connecting directly with a wider base of farmers. Require secure chat/negotiation interfaces and reliable notification systems for new farmer inquiries. Need tools to update raw material pricing dynamically based on market fluctuations.
3. **System Administrators / Content Managers:** A behind-the-scenes user class critical for maintaining the platform's accuracy, security, and technical health.
   - **Frequency of Use:** Daily/Continuous.
   - **Subset of Functions Used:** Administrative dashboards, database management, user moderation, and ML model monitoring.
   - **Technical Expertise:** High (IT professionals, data scientists, and agricultural data clerks).
   - **Pertinent Characteristics:** Responsible for manually updating the portal with the latest government DBT schemes, rules, and eligibility criteria so the SVM/Decision Tree recommendation engine stays accurate. Monitor the performance of the EfficientNet/ResNet50 image processing models and re-train them if disease prediction accuracy drops. Possess high security and privilege levels to manage user data, resolve marketplace disputes, and maintain system uptime.

### 2.4 Operating Environment 
1. **Client-side (User interface)** 
   - **Hardware:** Mobile platform with minimum 2GB RAM and a functional camera (minimum 5MP) or PC with stable internet connection. 
   - **Operating System:** Android 8.0 and above or iOS 12 and above. For PC, Windows 10 above, macOS or Linux 
   - **Supported Web Browsers:** Modern, HTML5-compliant browsers with JavaScript enabled, including Google Chrome (recommended for Android), Mozilla Firefox, Apple Safari, and Microsoft Edge.
   - **Display:** Responsive design will support a wide range of screen resolutions, scaling down to minimum widths of 360px for budget smartphones.
2. **Server-side** 
   - **Hosting:** Stable cloud infrastructure like AWS/Azure 
   - **Computational Requirements:** Instances equipped with GPUs for Deep Learning tasks for crop disease detection are required. Standard CPU instances will be required for general request handling and running lightweight ML models. 
   - **Database:** A robust relational database (e.g., PostgreSQL or MySQL) for user profiles, marketplace listings, and scheme data, potentially paired with cloud object storage (e.g., AWS S3) to securely store uploaded crop images.
3. **Network Environment** 
   - Standard internet connectivity like 3G/4G is required to load UI elements and image uploads. 
   - Secure HTTP (HTTPS) will be enforced across the platform to protect user data, marketplace communications, and DBT eligibility details.

### 2.5 Design and Implementation Constraints 
1. **Technological and Algorithmic Constraints:** Deep Learning Architecture: The crop disease detection tool must be implemented using EfficientNet and ResNet50 architectures. The backend infrastructure must be capable of supporting the heavy computational (GPU) requirements of running inference on these specific models. Platform Nature: The solution must be delivered as a web-based application (rather than a native mobile app) to bypass the need for app store downloads and updates, requiring the UI to be strictly responsive across a wide range of mobile browsers.
2. **Hardware and Network Limitations:** Low-Bandwidth Optimization: Because the primary user base resides in rural Indian regions where network connectivity can fluctuate (2G/3G/spotty 4G), the web application must be highly optimized. Client-side image compression must be enforced before transmitting crop photos to the deep learning models to prevent timeouts. Device Constraints: The interface must be lightweight enough to render smoothly on budget-tier Android smartphones with limited processing power and memory (as low as 2GB RAM).
3. **Linguistic and Accessibility Constraints:** Regional Language Mandate: English cannot be the sole language of the platform. The architecture must support robust internationalization (i18n) to deliver the UI, DBT scheme details, and marketplace negotiations in major Indian regional languages (e.g., Hindi, Marathi, Tamil, Telugu, Punjabi). Visual-First Interface: Due to varying literacy levels among the primary user class, the UI design is constrained to rely heavily on iconography, color-coding, and intuitive layouts rather than text-heavy instructions.
4. **Regulatory and Security Constraints:** Data Privacy Compliance: The portal handles sensitive user information, including location data, agricultural asset details, and potentially financial identifiers linked to Direct Benefit Transfer (DBT) schemes. The database and data-handling practices must comply with Indian data privacy regulations, such as the Digital Personal Data Protection (DPDP) Act. Marketplace Trust: While the platform facilitates raw material negotiation, the system architecture must securely isolate chat/negotiation data between farmers and dealers to prevent price fixing or data scraping by third parties.
5. **Data Availability and Model Retraining:** Agricultural Data Dependency: The accuracy of the yield prediction and disease detection models is strictly constrained by the quality and regional specificity of the training data (e.g., Indian crop varieties, local soil types, regional weather patterns). The system design must include data pipelines for continuous model retraining as new regional data is acquired.

### 2.6 User Documentation 
- **Farmer-centric user manual:** This manual will contain very simple steps to use the portal in a visually appealing manner. It will include guidelines on: 
  - How to take and upload a clear photo of a diseased crop.
  - How to browse and apply for recommended DBT schemes.
  - How to search for raw materials and contact dealers.
- **Dealer & Supplier Documentation:** This will be for vendors enlisting themselves on the platform. It will include:
  - How to register a product along with price quotation 
  - How to use price negotiation interface 
  - Best practices 

### 2.7 Assumptions and Dependencies 
- The farmer is assumed to have the minimum system requirements such as internet connection and compatible device to run the web app 
- Dataset being used for training CNN models are as generalized and clean as possible 
- Farmers input correct personal information 
- GPU instances are capable enough to handle multiple requests from users
- For multilingual support, the external APIs used for translation are assumed to have accurate translation capabilities
- DBT scheme data is assumed to be accurate and updatable in real time as well. 

## 3. External Interface Requirements 

### 3.1 User Interfaces 
The user interface (UI) must prioritize accessibility for rural farmers, focusing on a mobile-first, highly visual, and multilingual experience.
- **Logical Characteristics:** The portal will employ a responsive web design to ensure compatibility across mobile devices and desktops. The UI will heavily utilize iconography (e.g., a tractor for the marketplace, a leaf with a magnifying glass for disease detection) to minimize reliance on text.
- **Standard Layout Components:**
  - **Global Navigation:** A persistent bottom navigation bar on mobile containing links to core modules: Home, Schemes, Disease Check, Market, and Profile.
  - **Universal Header:** Every screen will feature a persistent header containing a "Language Toggle" drop-down and a "Help/Audio Guide" button.
- **Design Standards:** The UI will be constructed using modern utility-first CSS frameworks (such as Tailwind CSS) to ensure rapid, consistent, and responsive styling without bloated stylesheets. High contrast color schemes (e.g., deep greens and earthy tones) will be used to ensure readability under direct sunlight in the field.
- **Error Handling:** Error messages (e.g., "Image too blurry for analysis" or "Network disconnected") will be displayed using non-intrusive toast notifications at the top of the screen, color-coded red, accompanied by a warning icon, and translated into the active regional language.

### 3.2 Hardware Interfaces 
- **Client Device Camera:** The crop disease detection module requires interface with the user's smartphone or desktop camera. The web application will utilize the standard HTML5 `MediaDevices.getUserMedia()` API to request permission and capture image data from the device's hardware camera.
- **Storage Access:** The application will require read access to the device's local file system or photo gallery (via standard `<input type="file">` HTML tags) to allow users to upload previously taken images of diseased crops.

### 3.3 Software Interfaces 
The system relies on a decoupled architecture, requiring seamless communication between the frontend client, the backend server, the database, and the machine learning environments.
- **Frontend to Backend Connection:** The client-side application (built using modern JavaScript frameworks like React) will communicate with an asynchronous Python-based FastAPI backend. All data exchange between the frontend and backend will be formatted as JSON over RESTful API endpoints.
- **Database Interfaces:** The backend will interface with a relational database (Supabase for PostgresSQL) to store and retrieve user profiles, marketplace listings, and the repository of DBT schemes. 
- **Machine Learning Integration:**
  - The Python backend will interface directly with Scikit-learn libraries to execute the SVM, Random Forest, KNN, or Decision Tree models for DBT scheme recommendations and yield prediction.
  - For the image processing module, the backend will interface with deep learning frameworks (e.g., PyTorch or TensorFlow) to pass incoming compressed image arrays to the pre-trained EfficientNet or ResNet50 models and retrieve classification outputs.
- **External APIs:** The system may interface with external government web services or scraping bots to periodically update the PostgreSQL database with the latest agricultural DBT schemes.

### 3.4 Communications Interfaces 
- **Standard Web Protocols:** All client-server communications will occur over HTTP/1.1 or HTTP/2.
- **Security and Encryption:** To protect sensitive demographic data and secure marketplace interactions, all communications must be encrypted in transit using HTTPS (TLS 1.2 or higher).
- **Real-Time Marketplace Chat:** The negotiation interface between farmers and dealers will utilize WebSockets (WSS protocol) to establish a persistent, full-duplex communication channel, allowing for real-time text message delivery without requiring constant page refreshes.

## 4. System Features 

### 4.1 Direct Benefit Transfer (DBT) Scheme Recommendation System
- **4.1.1 Description and Priority:** A machine learning-driven recommendation engine that matches farmers with eligible central and state government DBT schemes. Given that 18-67% of farmers miss out on these schemes due to confusion, this feature is classified as **High Priority**.
- **4.1.2 Stimulus/Response Sequences**
  - **Stimulus:** The farmer navigates to the "Schemes" section and inputs basic demographic and agricultural details (e.g., state, land holding size, crop type, annual income bracket).
  - **Response:** The system processes the input using classification algorithms against a database of government schemes and returns a ranked list of eligible schemes, complete with eligibility confidence scores and step-by-step application instructions.
- **4.1.3 Functional Requirements**
  - `REQ-4.1.1`: The system shall provide a multi-step, visually guided form to collect farmer profiling data (State, Category, Land Size, Crop).
  - `REQ-4.1.2`: The backend shall utilize Machine Learning models to map user profiles to scheme eligibility criteria.
  - `REQ-4.1.3`: The system shall display the recommended schemes in the user's selected regional language.
  - `REQ-4.1.4`: The system shall provide a clear "How to Apply" breakdown for each recommended scheme, including links to official government portals where applicable.
  - `REQ-4.1.5`: Administrators shall have a dashboard to create, update, or deprecate schemes in the database to ensure the ML model's training data remains current.

### 4.2 Crop Disease Detection using Image Processing
- **4.2.1 Description and Priority:** A diagnostic tool that allows farmers to upload photos of unhealthy crops. The system uses deep learning to identify the disease and recommend remedies. This is a core value proposition and is classified as **High Priority**.
- **4.2.2 Stimulus/Response Sequences**
  - **Stimulus:** The farmer clicks "Check Crop Health," grants camera permissions via the web browser, captures/uploads a photo of a leaf or crop, and taps "Analyze."
  - **Response:** The web application compresses the image and sends it to the backend. The backend runs inference and responds with the predicted disease name, a confidence percentage, and recommended treatments.
- **4.2.3 Functional Requirements**
  - `REQ-3.2.1`: The web interface shall allow users to upload images directly from their device storage or capture a new image using the device camera via HTML5 APIs.
  - `REQ-3.2.2`: The client-side application must compress the image to a maximum payload size (e.g., < 2MB) before transmission to optimize for low-bandwidth networks.
  - `REQ-3.2.3`: The backend shall process the image using Deep Learning architectures (specifically EfficientNet or ResNet50) to classify the crop disease.
  - `REQ-3.2.4`: The system shall return the results within 10 seconds under standard server load.
  - `REQ-3.2.5`: The system shall output the predicted disease name, a brief description, and chemical/organic treatment suggestions translated into the user's regional language.

### 4.3 Crop Yield Prediction
- **4.3.1 Description and Priority:** A predictive analytics tool designed to help farmers estimate their harvest volume based on environmental and agricultural inputs, aiding in financial planning and storage preparation. Classified as **Medium-High Priority**.
- **4.3.2 Stimulus/Response Sequences**
  - **Stimulus:** The farmer enters current season parameters (crop type, sowing area, region, and soil type).
  - **Response:** The system fetches historical and current environmental data (like rainfall and temperature), processes it alongside the user input, and returns an estimated yield range (e.g., in quintals or metric tons).
- **4.3.3 Functional Requirements**
  - `REQ-4.3.1`: The system shall accept user inputs regarding geographical location (district/state), crop variety, sowing area size, and soil type.
  - `REQ-4.3.2`: The backend shall utilize Machine Learning regression models (such as Random Forest, Support Vector Regression, or KNN) to calculate expected yield based on historical training data.
  - `REQ-4.3.3`: The system shall display the predicted yield in standard local agricultural units (e.g., Quintals, Bigha-to-Yield ratios) appropriate for the selected region.
  - `REQ-4.3.4`: The system shall include visual indicators (e.g., charts or gauges) to represent whether the predicted yield is below, at, or above historical averages for that region.

### 4.4 Interactive Marketplace Interface
- **4.4.1 Description and Priority:** A specialized e-commerce and communication interface connecting farmers with raw material dealers (seeds, fertilizers, equipment). It focuses on negotiation rather than direct, fixed-price checkout. Classified as **High Priority**.
- **4.4.2 Stimulus/Response Sequences**
  - **Stimulus:** A farmer browses dealer listings, selects a required raw material, and clicks "Negotiate / Contact Dealer."
  - **Response:** The system opens a secure, real-time chat window between the farmer and the dealer.
  - **Stimulus:** A dealer logs in.
  - **Response:** The dealer sees a dashboard of active inquiries, current listings, and can add new products.
- **4.4.3 Functional Requirements**
  - `REQ-4.4.1`: The system shall provide a search and filtering interface for farmers to browse raw materials by category, location, and dealer ratings.
  - `REQ-4.4.2`: The system shall provide a secure, persistent chat interface allowing text-based negotiation between the farmer and the dealer.
  - `REQ-4.4.3`: Dealers shall have a portal to Create, Read, Update, and Delete (CRUD) their product listings and update baseline pricing.
  - `REQ-4.4.4`: The system shall support localized UI elements and an option for auto-translation of chat messages if the dealer and farmer speak different languages.
  - `REQ-4.4.5`: The system shall obscure the direct phone numbers of both parties until both mutually agree to share contact information, ensuring platform integrity and privacy.

## 5. Other Nonfunctional Requirements 

### 5.1 Performance Requirements 
- **UI Rendering:** The frontend architecture, leveraging React 19 and Vite, must achieve a First Contentful Paint (FCP) of under 1.5 seconds on standard 3G/4G mobile networks.
- **Asynchronous Processing:** The backend APIs (utilizing FastAPI) must resolve standard queries—such as fetching marketplace listings or DBT scheme recommendations (SVM/Decision Tree inference)—in under 2 seconds.
- **Deep Learning Inference:** The crop disease detection tool, which relies on heavier ResNet50 or EfficientNet models, must return a diagnosis and treatment plan within 10 seconds of a successful image upload.
- **Scalability:** The system must seamlessly handle up to 10,000 concurrent active users without degradation in response times, particularly during peak agricultural windows (e.g., Kharif and Rabi sowing seasons).

### 5.2 Safety Requirements 
- **Chemical Application Warnings:** Any treatment plan recommended by the crop disease detection tool that includes chemical pesticides must be accompanied by a visually prominent hazard warning. This warning must advise the use of Personal Protective Equipment (PPE) and recommend consulting a local agricultural extension officer before application.
- **Liability Disclaimers:** The system must clearly state that AI-driven yield predictions and disease diagnoses are advisory. The platform assumes no legal liability for crop failure or financial loss resulting from these predictions.
- **Marketplace Safety:** The platform must display standard anti-fraud warnings in the marketplace chat interface, advising farmers against sending advance wire transfers to unverified dealers before receiving raw materials.

### 5.3 Security Requirements 
- **Database Security:** Data stored in the PostgreSQL(Supabase) database—specifically farmer land holding details and financial brackets used for DBT eligibility—must be protected via strict Row Level Security (RLS) policies.
- **Privacy and Anonymity:** Phone numbers and exact geographical coordinates of farmers must be masked in the marketplace until explicitly shared by the farmer within the negotiation chat.

### 5.4 Software Quality Attributes 
- **Usability (Highest Priority):** Given the target demographic, ease of use heavily outweighs ease of learning. The UI, styled with Tailwind CSS, must prioritize large touch targets, high-contrast visual cues, and iconography over text density.
- **Availability:** The web portal must maintain an uptime of 99.9%, as agricultural decisions are often highly time-sensitive (e.g., identifying a rapidly spreading blight).
- **Maintainability:** The backend must be highly modular. The JSON web-scraping pipelines that update the DBT schemes must be decoupled from the core application logic, allowing administrators to update scrapers without taking the platform offline.
- **Adaptability:** The ML pipelines must be designed to easily ingest new regional datasets so the yield prediction models can be continuously retrained and adapted to different Indian states without requiring a full system overhaul.

### 5.5 Business Rules 
- **BR-1 (Marketplace Access):** Anyone can register as a Farmer to browse schemes and use the disease detection tool, but users registering as Dealers must undergo a basic verification step (e.g., providing a valid GSTIN or local business license) before their marketplace listings go live.
- **BR-2 (Scheme Data Authority):** Only users with the "Administrator" role are permitted to approve, modify, or delete the government DBT scheme data stored in the database. Farmers are restricted to read-only access for this data.
- **BR-3 (Direct Interactions):** Dealers are prohibited from initiating the first message to a farmer. All marketplace negotiations must be initiated by the farmer querying a specific listing to prevent spam.

## Appendix A: Glossary 
- **API (Application Programming Interface):** A set of protocols allowing the React/Vite frontend to communicate with the FastAPI backend.
- **DBT (Direct Benefit Transfer):** An initiative by the Government of India to transfer subsidies and benefits directly into the bank accounts of targeted beneficiaries (farmers).
- **DPDP Act:** Digital Personal Data Protection Act, India's regulatory framework for data privacy.
- **EfficientNet / ResNet50:** Advanced Deep Learning neural network architectures used by the platform specifically for processing and classifying images of crop diseases.
- **FCP (First Contentful Paint):** A performance metric measuring how quickly the first piece of UI (rendered via Tailwind CSS) appears on the user's screen.
- **Kharif / Rabi:** The two primary agricultural crop sowing seasons in India, heavily dependent on monsoon and winter conditions respectively.
- **ML (Machine Learning):** The subset of AI utilizing algorithms like SVM (Support Vector Machines), KNN (K-Nearest Neighbors), and Random Forest for tasks like yield prediction and scheme recommendation.
- **RLS (Row Level Security):** A database security feature (utilized within PostgreSQL/Supabase) that restricts data access at the row level based on the user's identity, ensuring farmers only see their own private negotiations.
- **SPA (Single Page Application):** A web application architecture where the browser loads a single HTML page and dynamically updates content as the user interacts, without requiring full page reloads.
- **WSS (WebSocket Secure):** An encrypted communication protocol providing full-duplex communication channels over a single TCP connection, used for real-time marketplace chat.
 
## Appendix B: Analysis Models 
- TBD

## Appendix C: To Be Determined List 
- **TBD-1 (Cloud Infrastructure):** Final selection of the cloud service provider (AWS, Google Cloud, or Azure) to host the backend and GPU instances for the deep learning models, pending final cost-benefit analysis.
- **TBD-2 (Data Sourcing):** Identification of the exact third-party meteorological and agricultural datasets/APIs to be used for training the Yield Prediction algorithms (SVM, Random Forest) on historical Indian crop yields.
- **TBD-3 (Regional Languages):** Final determination of the specific 3 to 5 regional Indian languages that will be supported in the initial Minimum Viable Product (MVP) launch, aside from English and Hindi.
