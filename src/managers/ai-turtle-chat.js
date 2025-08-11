// AI Turtle Chat - Provides educational content and motivational messages
// Remove ES6 export and make this a regular JavaScript class

class AITurtleChat {
  constructor() {
    this.oceanFacts = [
      "Did you know that sea turtles can live up to 80 years?",
      "Sea turtles have been swimming in our oceans for over 100 million years!",
      "Only about 1 in 1,000 sea turtle hatchlings survive to adulthood.",
      "Sea turtles can hold their breath for up to 5 hours while sleeping.",
      "The leatherback sea turtle can dive deeper than 1,000 meters!",
      "Sea turtles help maintain healthy coral reefs by eating sponges.",
      "Female sea turtles return to the same beach where they were born to lay eggs.",
      "Plastic pollution kills over 100,000 marine animals each year.",
      "Sea turtles are excellent navigators and can find their way across entire oceans.",
      "The green sea turtle gets its name from the green color of its body fat."
    ];
    
    this.conservationTips = [
      "Always dispose of plastic waste properly to keep it out of the ocean.",
      "Use reusable water bottles and shopping bags to reduce plastic waste.",
      "Participate in beach cleanups to help protect marine life.",
      "Choose sustainable seafood to support healthy ocean ecosystems.",
      "Reduce your carbon footprint to help combat ocean acidification.",
      "Support organizations that protect sea turtles and their habitats.",
      "Never release balloons outdoors - they often end up in the ocean.",
      "Use reef-safe sunscreen to protect coral reefs and marine life.",
      "Educate others about the importance of ocean conservation.",
      "Every small action counts in protecting our oceans!"
    ];
    
    this.levelMessages = {
      1: "Welcome to the ocean! Let's start cleaning up this beautiful underwater world.",
      2: "Great progress! The ocean is already looking cleaner thanks to you.",
      3: "You're becoming a true ocean guardian! Keep up the amazing work.",
      4: "The marine life is starting to return! Your efforts are making a difference.",
      5: "Halfway there! The ocean ecosystem is thriving under your care.",
      6: "Incredible work! You're inspiring others to protect our oceans.",
      7: "The ocean is almost pristine! You're a true environmental hero.",
      8: "Nearly there! The sea turtles are swimming freely thanks to you.",
      9: "Almost perfect! The ocean is a paradise once again.",
      10: "Congratulations! You've restored the ocean to its natural beauty!"
    };
    
    this.achievementMessages = {
      'first-trash': "Great start! Every piece of trash removed helps save marine life.",
      'trash-master': "Trash Master! You're becoming an expert at ocean cleanup.",
      'speed-demon': "Speed Demon! Your turtle is faster than a dolphin!",
      'shield-bearer': "Shield Bearer! Nothing can stop your ocean-saving mission!",
      'magnet-master': "Magnet Master! You're attracting trash like a pro!",
      'ocean-hero': "Ocean Hero! You've saved countless marine creatures!",
      'conservation-champion': "Conservation Champion! The ocean thanks you!",
      'turtle-legend': "Turtle Legend! You're the greatest ocean protector ever!"
    };
  }
  
  getLevelCompleteMessage(level) {
    const baseMessage = this.levelMessages[level] || this.levelMessages[10];
    const fact = this.getRandomOceanFact();
    const tip = this.getRandomConservationTip();
    
    return `${baseMessage} ${fact} ${tip}`;
  }
  
  getRandomOceanFact() {
    return this.oceanFacts[Math.floor(Math.random() * this.oceanFacts.length)];
  }
  
  getRandomConservationTip() {
    return this.conservationTips[Math.floor(Math.random() * this.conservationTips.length)];
  }
  
  getAchievementMessage(achievement) {
    return this.achievementMessages[achievement] || "Great job! You're helping save the ocean!";
  }
  
  getMotivationalMessage(score, trashCollected) {
    if (score > 10000) {
      return "You're absolutely crushing it! The ocean is lucky to have you!";
    } else if (score > 5000) {
      return "Amazing work! You're a true ocean warrior!";
    } else if (score > 1000) {
      return "Keep going! Every piece of trash you collect makes a difference!";
    } else {
      return "Great start! You're on your way to becoming an ocean hero!";
    }
  }
  
  getTrashCollectionMessage(trashType) {
    const messages = {
      'plastic-bottle': "Plastic bottles can take up to 450 years to decompose! Great job removing this!",
      'fishing-net': "Ghost nets are deadly to marine life. You've saved countless animals!",
      'soda-can': "Aluminum cans can be recycled infinitely. You're helping the environment!",
      'plastic-bag': "Plastic bags are often mistaken for jellyfish by sea turtles. You're a lifesaver!"
    };
    
    return messages[trashType] || "Every piece of trash removed helps protect marine life!";
  }
  
  getHazardAvoidanceMessage(hazardType) {
    const messages = {
      'shark': "Sharks are important apex predators that help maintain ocean balance!",
      'jellyfish': "Jellyfish blooms can indicate ocean health issues. Stay safe!",
      'fishing-net': "Ghost fishing gear is a major threat to marine life. Avoid it!"
    };
    
    return messages[hazardType] || "Stay safe out there! The ocean can be unpredictable.";
  }
  
  getPowerUpMessage(powerUpType) {
    const messages = {
      'turbo': "Turbo boost activated! You're faster than a sailfish now!",
      'shield': "Shield activated! You're protected from all hazards!",
      'magnet': "Magnet activated! Trash is being drawn to you like magic!"
    };
    
    return messages[powerUpType] || "Power-up activated! You're unstoppable!";
  }
  
  getDailyMessage() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    
    const dailyMessages = [
      "Today is World Oceans Day! Let's celebrate by keeping our oceans clean!",
      "Did you know that sea turtles can sense the Earth's magnetic field?",
      "The ocean produces over 50% of the oxygen we breathe. Let's protect it!",
      "Sea turtles are ancient mariners that have survived multiple mass extinctions.",
      "Every year, 8 million tons of plastic enter our oceans. Let's change that!",
      "Coral reefs support 25% of all marine life. They need our protection!",
      "The Great Pacific Garbage Patch is twice the size of Texas. We can fix this!",
      "Sea turtles help maintain healthy seagrass beds, which are vital for marine life.",
      "Ocean acidification is threatening shellfish and coral reefs worldwide.",
      "Marine protected areas help sea turtles and other ocean life thrive."
    ];
    
    return dailyMessages[dayOfYear % dailyMessages.length];
  }
  
  getEnvironmentalImpact(trashCollected) {
    const impacts = [
      { threshold: 1, message: "You've saved 1 marine animal from potential harm!" },
      { threshold: 5, message: "You've prevented 5 pieces of trash from entering the food chain!" },
      { threshold: 10, message: "You've helped protect coral reefs from plastic damage!" },
      { threshold: 25, message: "You've saved enough space for sea turtle nesting!" },
      { threshold: 50, message: "You've prevented a small garbage patch from forming!" },
      { threshold: 100, message: "You've saved an entire ecosystem from plastic pollution!" }
    ];
    
    for (let i = impacts.length - 1; i >= 0; i--) {
      if (trashCollected >= impacts[i].threshold) {
        return impacts[i].message;
      }
    }
    
    return "Every piece of trash you collect makes a difference!";
  }
  
  getEducationalTip() {
    const tips = [
      "Sea turtles are excellent indicators of ocean health.",
      "Plastic pollution affects over 700 species of marine animals.",
      "The ocean absorbs 30% of human-produced carbon dioxide.",
      "Sea turtles help maintain healthy seagrass beds.",
      "Marine debris can travel thousands of miles on ocean currents.",
      "Sea turtles have been on Earth since the time of dinosaurs.",
      "Ocean pollution affects human health through seafood consumption.",
      "Sea turtles are protected by international law in most countries."
    ];
    
    return tips[Math.floor(Math.random() * tips.length)];
  }
  
  // Generate a personalized message based on player performance
  getPersonalizedMessage(playerStats) {
    const { totalGames, bestScore, totalTrash, highestLevel } = playerStats;
    
    if (totalGames === 0) {
      return "Welcome to TurtleQuest! Let's start your ocean-saving adventure!";
    }
    
    if (totalTrash > 1000) {
      return "You're a true ocean conservationist! Your dedication is inspiring!";
    } else if (totalTrash > 500) {
      return "Amazing progress! You're making a real difference in ocean health!";
    } else if (totalTrash > 100) {
      return "Great work! You're becoming an ocean protection expert!";
    } else {
      return "Keep going! Every piece of trash you collect helps save marine life!";
    }
  }
}
