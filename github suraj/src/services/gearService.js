/**
 * Gear Service (Mock API Layer)
 * 
 * This file centralizes all logic for managing gear requests. 
 * Currently it uses local state/promises, but is structured to 
 * connect directly to Supabase in the future.
 */

export const createGearRequest = async (gearData) => {
  /**
   * Data payload structure prepared for Supabase:
   * {
   *   user_id: string,
   *   trek_name: string,
   *   gear_item: string,
   *   quantity: number,
   *   notes: string,
   *   status: "pending",
   *   created_at: Date
   * }
   */
  
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('API: Creating Gear Request...', gearData);
      resolve({
        success: true,
        data: {
          ...gearData,
          id: Math.random().toString(36).substr(2, 9), // Temporary unique ID
          created_at: gearData.created_at || new Date()
        }
      });
    }, 500);
  });
};

export const getGearRequests = async (userId = "mock-user") => {
  // Simulating fetching data from a database
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('API: Fetching Gear Requests for user:', userId);
      resolve([
        // Example mock data
        /*
        {
          id: 'example-1',
          user_id: 'mock-user',
          trek_name: 'Everest Base Camp',
          gear_item: 'Trekking Poles',
          quantity: 2,
          notes: 'Prefer carbon fiber if available.',
          status: 'pending',
          created_at: new Date(Date.now() - 86400000)
        }
        */
      ]);
    }, 300);
  });
};
