import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvQvQvQvQvQvQvQvQvQvQvQvQvQvQvQvQ",
  authDomain: "foundit-app.firebaseapp.com",
  projectId: "foundit-app",
  storageBucket: "foundit-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnopqrstuvwxyz"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const examplePosts = [
  // Lost Item Example
  {
    title: "Lost: Black iPhone 13 Pro",
    description: "I lost my black iPhone 13 Pro yesterday evening around 7 PM. It has a clear case with a photo of my family inside. The phone was last seen near the main entrance. It's very important to me as it contains precious family photos. Please contact me if found!",
    category: "Lost",
    contactName: "Sarah Johnson",
    contactPhone: "0821234567",
    contactEmail: "sarah.johnson@email.com",
    contactWhatsApp: "0821234567",
    unitNumber: "Unit 15",
    image: "/example-images/lost-iphone.svg",
    isAdminPost: true,
    datePosted: serverTimestamp(),
    createdAt: serverTimestamp()
  },
  
  // Found Item Example
  {
    title: "Found: Blue Backpack with Laptop",
    description: "Found a blue backpack containing a Dell laptop near the parking area this morning. The backpack also has some books and a water bottle. I've kept it safe and would like to return it to the rightful owner. Please describe the contents to claim it.",
    category: "Found",
    contactName: "Mike Chen",
    contactPhone: "0834567890",
    contactEmail: "mike.chen@email.com",
    contactWhatsApp: "0834567890",
    unitNumber: "Unit 8",
    image: "/example-images/found-backpack.svg",
    isAdminPost: true,
    datePosted: serverTimestamp(),
    createdAt: serverTimestamp()
  },
  
  // For Sale/Services Example
  {
    title: "Professional Photography Services",
    description: "Offering professional photography services for events, portraits, and real estate. 10+ years experience with high-quality equipment. Specializing in family portraits, corporate events, and property photography. Competitive rates and flexible scheduling available.",
    category: "For Sale/Services",
    price: 500,
    contactName: "David Wilson",
    contactPhone: "0845678901",
    contactEmail: "david.wilson@photography.com",
    contactWhatsApp: "0845678901",
    unitNumber: "Unit 22",
    image: "/example-images/photography-service.svg",
    website: "https://davidwilsonphotography.com",
    socialMedia: "https://instagram.com/davidwilsonphoto",
    isAdminPost: true,
    datePosted: serverTimestamp(),
    createdAt: serverTimestamp()
  },
  
  // Additional Lost Item
  {
    title: "Lost: Golden Retriever - Max",
    description: "Our beloved golden retriever Max went missing yesterday afternoon. He's 3 years old, very friendly, and wearing a blue collar with our contact info. Last seen near the playground area. He responds to his name and loves treats. Please help us find him!",
    category: "Lost",
    contactName: "Emma Thompson",
    contactPhone: "0856789012",
    contactEmail: "emma.thompson@email.com",
    contactWhatsApp: "0856789012",
    unitNumber: "Unit 12",
    image: "/example-images/lost-dog.svg",
    isAdminPost: true,
    datePosted: serverTimestamp(),
    createdAt: serverTimestamp()
  },
  
  // Additional Found Item
  {
    title: "Found: Set of Car Keys",
    description: "Found a set of car keys with a small keychain near the mailboxes. The keys appear to be for a Toyota vehicle. I've left them with the building security. Please contact me to describe the keychain to claim them.",
    category: "Found",
    contactName: "Lisa Park",
    contactPhone: "0867890123",
    contactEmail: "lisa.park@email.com",
    contactWhatsApp: "0867890123",
    unitNumber: "Unit 5",
    image: "/example-images/found-keys.svg",
    isAdminPost: true,
    datePosted: serverTimestamp(),
    createdAt: serverTimestamp()
  },
  
  // Additional For Sale/Services
  {
    title: "Home Tutoring - Mathematics & Science",
    description: "Experienced tutor offering mathematics and science tutoring for high school students. Bachelor's degree in Engineering with 5+ years teaching experience. Available evenings and weekends. Can help with exam preparation and homework assistance.",
    category: "For Sale/Services",
    price: 200,
    contactName: "Dr. James Miller",
    contactPhone: "0878901234",
    contactEmail: "james.miller@tutoring.com",
    contactWhatsApp: "0878901234",
    unitNumber: "Unit 18",
    image: "/example-images/tutoring-service.svg",
    website: "https://jamesmiller-tutoring.com",
    socialMedia: "https://facebook.com/jamesmiller-tutoring",
    isAdminPost: true,
    datePosted: serverTimestamp(),
    createdAt: serverTimestamp()
  }
];

async function seedDatabase() {
  console.log('Starting to seed example posts...');
  
  try {
    for (const postData of examplePosts) {
      await addDoc(collection(db, 'posts'), postData);
      console.log(`Created example post: ${postData.title}`);
    }
    
    console.log('Successfully seeded all example posts!');
  } catch (error) {
    console.error('Error seeding example posts:', error);
  }
}

seedDatabase();