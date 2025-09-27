import AsyncStorage from '@react-native-async-storage/async-storage';

// Database keys
const KEYS = {
  USERS: 'users',
  CURRENT_USER: 'current_user',
  CARDS: 'cards',
  CONNECTIONS: 'connections',
};

// User management
export const UserDB = {
  // Create a new user
  async createUser(userData) {
    try {
      const users = await this.getAllUsers();
      const newUser = {
        id: Date.now().toString(),
        username: userData.username,
        email: userData.email,
        password: userData.password, // In real app, this should be hashed
        createdAt: new Date().toISOString(),
        cards: [], // User's card collection
        connections: [], // User's connections
      };
      
      users.push(newUser);
      await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(users));
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all users
  async getAllUsers() {
    try {
      const users = await AsyncStorage.getItem(KEYS.USERS);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  },

  // Find user by email
  async findUserByEmail(email) {
    try {
      const users = await this.getAllUsers();
      return users.find(user => user.email.toLowerCase() === email.toLowerCase());
    } catch (error) {
      console.error('Error finding user:', error);
      return null;
    }
  },

  // Find user by username
  async findUserByUsername(username) {
    try {
      const users = await this.getAllUsers();
      return users.find(user => user.username.toLowerCase() === username.toLowerCase());
    } catch (error) {
      console.error('Error finding user:', error);
      return null;
    }
  },

  // Authenticate user
  async authenticateUser(email, password) {
    try {
      const user = await this.findUserByEmail(email);
      if (user && user.password === password) {
        await this.setCurrentUser(user);
        return { success: true, user };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      console.error('Error authenticating user:', error);
      return { success: false, error: error.message };
    }
  },

  // Set current user
  async setCurrentUser(user) {
    try {
      await AsyncStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error setting current user:', error);
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const user = await AsyncStorage.getItem(KEYS.CURRENT_USER);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Logout user
  async logoutUser() {
    try {
      await AsyncStorage.removeItem(KEYS.CURRENT_USER);
    } catch (error) {
      console.error('Error logging out user:', error);
    }
  },

  // Update user
  async updateUser(userId, updates) {
    try {
      const users = await this.getAllUsers();
      const userIndex = users.findIndex(user => user.id === userId);
      
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(users));
        
        // Update current user if it's the same user
        const currentUser = await this.getCurrentUser();
        if (currentUser && currentUser.id === userId) {
          await this.setCurrentUser(users[userIndex]);
        }
        
        return { success: true, user: users[userIndex] };
      }
      return { success: false, error: 'User not found' };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: error.message };
    }
  },
};

// Card management
export const CardDB = {
  // Get all available cards
  async getAllCards() {
    try {
      const cards = await AsyncStorage.getItem(KEYS.CARDS);
      if (cards) {
        return JSON.parse(cards);
      }
      
      // Initialize with basic cards if none exist
      const basicCards = [
        { id: 'fire', name: 'Fire', emoji: '🔥', element: 'fire', rarity: 'common' },
        { id: 'water', name: 'Water', emoji: '💧', element: 'water', rarity: 'common' },
        { id: 'air', name: 'Air', emoji: '💨', element: 'air', rarity: 'common' },
        { id: 'earth', name: 'Earth', emoji: '🌍', element: 'earth', rarity: 'common' },
        { id: 'lightning', name: 'Lightning', emoji: '⚡', element: 'lightning', rarity: 'common' },
        { id: 'ice', name: 'Ice', emoji: '❄️', element: 'ice', rarity: 'uncommon' },
        { id: 'shadow', name: 'Shadow', emoji: '🌑', element: 'shadow', rarity: 'rare' },
        { id: 'light', name: 'Light', emoji: '✨', element: 'light', rarity: 'rare' },
      ];
      
      await AsyncStorage.setItem(KEYS.CARDS, JSON.stringify(basicCards));
      return basicCards;
    } catch (error) {
      console.error('Error getting cards:', error);
      return [];
    }
  },

  // Add card to user's collection
  async addCardToUser(userId, cardId) {
    try {
      const user = await UserDB.getCurrentUser();
      if (user && user.id === userId) {
        const cards = await this.getAllCards();
        const card = cards.find(c => c.id === cardId);
        
        if (card && !user.cards.some(c => c.id === cardId)) {
          user.cards.push(card);
          await UserDB.updateUser(userId, { cards: user.cards });
          return { success: true, card };
        }
      }
      return { success: false, error: 'Card not found or already owned' };
    } catch (error) {
      console.error('Error adding card to user:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user's cards
  async getUserCards(userId) {
    try {
      const user = await UserDB.getCurrentUser();
      return user ? user.cards : [];
    } catch (error) {
      console.error('Error getting user cards:', error);
      return [];
    }
  },
};

// Connection management
export const ConnectionDB = {
  // Create a connection between two users
  async createConnection(user1Id, user2Id, connectionCode) {
    try {
      const connections = await this.getAllConnections();
      const newConnection = {
        id: Date.now().toString(),
        user1Id,
        user2Id,
        connectionCode,
        createdAt: new Date().toISOString(),
        status: 'active',
      };
      
      connections.push(newConnection);
      await AsyncStorage.setItem(KEYS.CONNECTIONS, JSON.stringify(connections));
      return { success: true, connection: newConnection };
    } catch (error) {
      console.error('Error creating connection:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all connections
  async getAllConnections() {
    try {
      const connections = await AsyncStorage.getItem(KEYS.CONNECTIONS);
      return connections ? JSON.parse(connections) : [];
    } catch (error) {
      console.error('Error getting connections:', error);
      return [];
    }
  },

  // Get user's connections
  async getUserConnections(userId) {
    try {
      const connections = await this.getAllConnections();
      return connections.filter(conn => 
        conn.user1Id === userId || conn.user2Id === userId
      );
    } catch (error) {
      console.error('Error getting user connections:', error);
      return [];
    }
  },
};

// Utility functions
export const DatabaseUtils = {
  // Clear all data (for testing)
  async clearAllData() {
    try {
      await AsyncStorage.multiRemove([
        KEYS.USERS,
        KEYS.CURRENT_USER,
        KEYS.CARDS,
        KEYS.CONNECTIONS,
      ]);
      return { success: true };
    } catch (error) {
      console.error('Error clearing data:', error);
      return { success: false, error: error.message };
    }
  },

  // Get database stats
  async getStats() {
    try {
      const users = await UserDB.getAllUsers();
      const cards = await CardDB.getAllCards();
      const connections = await ConnectionDB.getAllConnections();
      const currentUser = await UserDB.getCurrentUser();
      
      return {
        totalUsers: users.length,
        totalCards: cards.length,
        totalConnections: connections.length,
        currentUser: currentUser ? currentUser.username : null,
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return null;
    }
  },
};
