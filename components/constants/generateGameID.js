export function generateGameID() {
    // Helper function to generate a random string of a given length
    const randomString = (length) => {
      const chars = 'abcdefghijklmnopqrstuvwxyz';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };
  
    // Generate three parts: "abc", "defg", "hij"
    const part1 = randomString(3); // First part: 3 characters
    const part2 = randomString(4); // Second part: 4 characters
    const part3 = randomString(3); // Third part: 3 characters
  
    // Join the parts with hyphens
    return `${part1}-${part2}-${part3}`;
  }
  