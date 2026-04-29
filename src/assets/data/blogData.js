import userImg1 from "../images/Blog-Images/users/user1.avif";
import userImg2 from "../images/Blog-Images/users/user2.avif";
import userImg3 from "../images/Blog-Images/users/user3.jpg";
import userImg4 from "../images/Blog-Images/users/user4.avif";
import userImg5 from "../images/Blog-Images/users/user5.jpg";

const blogData = [
  {
    id: 1,
    blogTitle: "The best way to drive cars",
    param: "blog1",
    blogContent:
      "Driving a car isn't just about getting from point A to B; it's an art that requires skill, awareness, and responsible behavior...",
    fullBlogContent:
      "Driving a car isn't just about getting from point A to B; it's an art that requires skill, awareness, and responsible behavior. Whether you're a new driver or an experienced one looking to enhance your driving prowess, this guide is here to walk you through the best practices that can make every drive a safe, smooth, and enjoyable experience.",
    keyPoints: [
      {
        id: 1,
        heading: "Preparation and Awareness:",
        subHeading:
          "Before hitting the road, take a moment to ensure that you're mentally and physically prepared for the journey ahead. Adjust your seat, mirrors, and steering wheel for comfort and proper visibility. Familiarize yourself with the vehicle's controls, and ensure that all passengers are buckled up.",
      },
      {
        id: 2,
        heading: "Defensive Driving:",
        subHeading:
          "Adopt a defensive driving approach that prioritizes safety and anticipates potential hazards. Maintain a safe following distance from the vehicle ahead and keep an eye on your surroundings. Always be prepared to react to unexpected situations, such as sudden stops or lane changes.",
      },
      {
        id: 3,
        heading: "Smooth Acceleration and Braking:",
        subHeading:
          "Avoid sudden and aggressive acceleration or braking, as it can lead to discomfort for passengers and increase wear and tear on the vehicle. Gradually apply pressure to the accelerator and brake pedals to achieve smoother transitions and conserve fuel.",
      },
      {
        id: 4,
        heading: "Steering Techniques:",
        subHeading:
          "Practice smooth and controlled steering movements. Use both hands on the steering wheel and avoid oversteering. For turns, use the push-pull technique – push the wheel up with one hand while pulling down with the other – for precise control.",
      },
      {
        id: 5,
        heading: "Observational Skills:",
        subHeading:
          "Keep a constant scan of the road, checking your mirrors and blind spots regularly. Use your mirrors to monitor traffic behind and beside you, and glance ahead to anticipate changes in traffic flow.",
      },
      {
        id: 6,
        heading: "Proper Lane Usage:",
        subHeading:
          "Before hitting the road, take a moment to ensure that you're mentally and physically prepared for the journey ahead. Adjust your seat, mirrors, and steering wheel for comfort and proper visibility. Familiarize yourself with the vehicle's controls, and ensure that all passengers are buckled up.",
      },
      {
        id: 7,
        heading: "Smooth Gear Changes (Manual Transmission):",
        subHeading:
          "If driving a manual transmission vehicle, practice smooth gear changes that minimize jerking and stalling. Match the engine's RPM to the appropriate gear for seamless transitions.",
      },
      {
        id: 8,
        heading: "Conclusion:",
        subHeading:
          "Mastering the art of driving requires a combination of skill, attentiveness, and responsible behavior. By adopting defensive driving practices, honing your observational skills, and practicing smooth and controlled maneuvers, you can transform your driving experience into one that's safer, more enjoyable, and contributes to a more harmonious road environment for all. Remember, every time you get behind the wheel, you have the opportunity to showcase the best driving practices and set an example for others on the road.",
      },
    ],
    buttonContent: "Read More",
    userName: "John Shaw",
    date: "11 Aug, 2023",
    time: "9:30pm",
    imgUrl:
      "https://ik.imagekit.io/zusxqcpbw/tr:w-800/blog-image1.webp?updatedAt=1694599415504",
    replies: [
      {
        id: 1,
        user: "Jack Cowell",
        dateOfReply: "13 Aug, 2023",
        timeOfReply: "10:33am",
        reply: "This was really helpful, just the content I was looking for!",
        pfp: userImg1,
      },
      {
        id: 2,
        user: "Simon Palm",
        dateOfReply: "13 Aug, 2023",
        timeOfReply: "9:45pm",
        reply: "👍👍👍",
        pfp: userImg2,
      },
      {
        id: 3,
        user: "Gibby Dyno",
        dateOfReply: "14 Aug, 2023",
        timeOfReply: "6:21pm",
        reply:
          "Wow, great content, this is some good piece of information right here",
        pfp: userImg3,
      },
    ],
  },
  {
    id: 2,
    blogTitle: "If your car battery is down ",
    param: "blog2",
    blogContent:
      "Few things are as frustrating as encountering a dead car battery, especially when you're pressed for time...",
    fullBlogContent:
      "Few things are as frustrating as encountering a dead car battery, especially when you're pressed for time. But fear not - a dead battery doesn't have to derail your plans entirely. With a little know-how and preparation, you can tackle this common issue and get your vehicle up and running again.",
    keyPoints: [
      {
        id: 1,
        heading: "Confirm the Issue:",
        subHeading:
          "When you turn the key and nothing happens, it's often a sign of a dead battery. However, rule out other possibilities like a faulty starter motor or alternator before assuming it's the battery.",
      },
      {
        id: 2,
        heading: "Safety First:",
        subHeading:
          "If you're on a busy road, move your vehicle to a safe location before attempting any fixes. Turn on your hazard lights to alert other drivers.",
      },
      {
        id: 3,
        heading: "Jump-Start Your Car:",
        subHeading:
          "Jump-starting your car is one of the quickest ways to revive a dead battery. You'll need a set of jumper cables and a working vehicle to help. Connect the cables to both cars' batteries, ensuring the red clamp goes to the positive (+) terminal and the black clamp to the negative (-) terminal. Start the working car's engine and let it run for a few minutes, then try starting your car.",
      },
      {
        id: 4,
        heading: "Battery Charger:",
        subHeading:
          "If you have access to a battery charger, it's a more gradual way to recharge your battery. Connect the charger according to the instructions and let it charge for a few hours or overnight.",
      },
      {
        id: 5,
        heading: "Push-Start (Manual Transmission):",
        subHeading:
          "If your car has a manual transmission, you can try push-starting it. Get some friends to help you push the car to a decent speed, then engage the clutch and shift to second gear. Quickly release the clutch while giving the car some gas. This might start the engine if the battery has just enough charge.",
      },
      {
        id: 6,
        heading: "Call for Assistance:",
        subHeading:
          "If jump-starting doesn't work or if your battery dies frequently, it might be time to call for professional assistance. Roadside assistance services can provide battery replacement or diagnose more complex issues.",
      },
      {
        id: 7,
        heading: "Carry Emergency Tools:",
        subHeading:
          "Keep a set of jumper cables, a portable battery charger, or a jump starter kit in your car's trunk. These tools can be a lifesaver in unexpected situations.",
      },
      {
        id: 8,
        heading: "Conclusion:",
        subHeading:
          "Encountering a dead car battery can be a frustrating experience, but armed with the right knowledge and tools, you can quickly get back on the road. From jump-starting your car to considering preventive measures, these tips will help you navigate this common issue and ensure that a dead battery doesn't stand in the way of your plans. Remember, it's always a good idea to stay prepared and informed when it comes to vehicle maintenance and troubleshooting.",
      },
    ],
    buttonContent: "Read More",
    userName: "Kate Gibbs",
    date: "13 Feb, 2023",
    time: "10:44am",
    imgUrl:
      "https://ik.imagekit.io/zusxqcpbw/tr:w-800/blog-image2.webp?updatedAt=1694599415528",
    replies: [
      {
        id: 1,
        user: "Jack Cowell",
        dateOfReply: "23 Feb, 2023",
        timeOfReply: "1:20pm",
        reply: "Nice, I've learnt a lot from this",
        pfp: userImg1,
      },
      {
        id: 2,
        user: "Joe Fuchz",
        dateOfReply: "13 Aug, 2023",
        timeOfReply: "3:46pm",
        reply: "I encountered an issue and this solved my problem",
        pfp: userImg4,
      },
      {
        id: 3,
        user: "Chris Dane",
        dateOfReply: "14 Aug, 2023",
        timeOfReply: "7:44am",
        reply: "Amazing!",
        pfp: userImg5,
      },
      {
        id: 4,
        user: "Gibby Dyno",
        dateOfReply: "14 Aug, 2023",
        timeOfReply: "8:44am",
        reply: "This is a good piece of information and knowledge",
        pfp: userImg3,
      },
    ],
  },
  {
    id: 3,
    blogTitle: "The best way to give a trip",
    param: "blog3",
    blogContent:
      "Embarking on a trip is more than just a change of scenery – it's an opportunity to create lasting memories...",
    fullBlogContent:
      "Embarking on a trip is more than just a change of scenery – it's an opportunity to create lasting memories, indulge in new experiences, and immerse yourself in the beauty of the world. Whether you're a seasoned traveler or setting out on your first adventure, here's a comprehensive guide to ensure your next trip is nothing short of extraordinary.",
    keyPoints: [
      {
        id: 1,
        heading: "Destination Discovery:",
        subHeading:
          "Start by choosing a destination that resonates with your interests, whether it's a bustling city, a serene beach, a charming countryside, or a rugged mountain range. Research different options, consider the local culture, weather, and activities available, and align your choice with what you seek from the journey.",
      },
      {
        id: 2,
        heading: "Detailed Itinerary:",
        subHeading:
          "Outline a rough itinerary to strike a balance between planned activities and spontaneous exploration. Include must-see attractions, cultural experiences, local cuisine, and ample free time to soak in the destination's essence.",
      },
      {
        id: 3,
        heading: "Budgeting Wisely:",
        subHeading:
          "Determine a realistic budget that encompasses transportation, accommodation, meals, activities, and unforeseen expenses. Opt for cost-effective options without compromising on quality, and allocate a bit extra for unexpected surprises.",
      },
      {
        id: 4,
        heading: "Accommodation Selection:",
        subHeading:
          "Choose accommodations that align with your travel style – whether it's a boutique hotel, a cozy bed and breakfast, a luxury resort, or a budget-friendly hostel. Consider factors like location, amenities, and guest reviews to ensure a comfortable stay.",
      },
      {
        id: 5,
        heading: "Packing Essentials:",
        subHeading:
          "Pack efficiently by creating a checklist of essentials, including clothing suitable for the destination's climate, comfortable footwear, travel-sized toiletries, essential documents (passport, visa, tickets), chargers, and any specialized gear you might need.",
      },
      {
        id: 6,
        heading: "Cultural Sensitivity:",
        subHeading:
          "Immerse yourself in the local culture by learning about customs, traditions, and etiquette. Respect local dress codes and practices, and interact with locals in a sensitive and respectful manner.",
      },
      {
        id: 7,
        heading: "Navigating Transportation:",
        subHeading:
          "Plan your transportation options, be it flights, trains, buses, or rental cars, well in advance. Consider factors like travel time, cost, and convenience to choose the best mode of transportation for your trip.",
      },
      {
        id: 8,
        heading: "Embrace Authentic Experiences:",
        subHeading:
          "Venture off the beaten path to discover hidden gems and authentic experiences that may not be in guidebooks. Engage with locals, visit local markets, and partake in cultural activities to gain a deeper understanding of the destination.",
      },
      {
        id: 9,
        heading: "Stay Connected and Safe:",
        subHeading:
          "Stay connected with loved ones by sharing your itinerary and checking in periodically. Invest in travel insurance to safeguard against unforeseen circumstances, and research local safety guidelines and emergency contacts.",
      },
      {
        id: 10,
        heading: "Capture Memories:",
        subHeading:
          "Document your journey through photographs, journal entries, or a travel blog. Capturing moments allows you to relive your experiences long after the trip is over.",
      },
      {
        id: 11,
        heading: "Conclusion:",
        subHeading:
          "A well-planned trip is a canvas on which you can paint your most cherished memories. By curating a thoughtful itinerary, immersing yourself in local culture, and embracing the authenticity of each destination, you'll create a journey that resonates deeply with your heart. Remember that each trip is an opportunity to grow, learn, and connect with the world around you, so embrace the adventure with an open mind and an open heart.",
      },
    ],
    buttonContent: "Read More",
    userName: "Daniel Ross",
    date: "11 Mar, 2023",
    time: "5:23pm",
    imgUrl:
      "https://ik.imagekit.io/zusxqcpbw/tr:w-800/blog-image3.webp?updatedAt=1694599415490",
    replies: [
      {
        id: 1,
        user: "Jack Cowell",
        dateOfReply: "23 Feb, 2023",
        timeOfReply: "1:20pm",
        reply: "This is a rich content, thanks for this",
        pfp: userImg5,
      },
      {
        id: 2,
        user: "Joe Fuchz",
        dateOfReply: "13 Aug, 2023",
        timeOfReply: "3:46pm",
        reply: "Cool stuff, just what I needed",
        pfp: userImg2,
      },
    ],
  },
];

export default blogData;
