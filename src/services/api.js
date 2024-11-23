// src/services/api.js
import axios from 'axios';

const BASE_URL = 'https://api.spacexdata.com/v4';

export const api = {
  getCompanyInfo: () => axios.get(`${BASE_URL}/company`),
  getRockets: () => axios.get(`${BASE_URL}/rockets`),
  getRocketById: (id) => axios.get(`${BASE_URL}/rockets/${id}`),
  getLaunches: () => axios.get(`${BASE_URL}/launches`),
  getLaunchById: async (id) => {
    try {
      const launchResponse = await axios.get(`${BASE_URL}/launches/${id}`);
      const launch = launchResponse.data;

      // Get additional details only if the main launch data is successfully fetched
      if (launch) {
        // Get launchpad details
        if (launch.launchpad) {
          try {
            const launchpadResponse = await axios.get(`${BASE_URL}/launchpads/${launch.launchpad}`);
            launch.launchpad_details = launchpadResponse.data;
          } catch (error) {
            console.log('Error fetching launchpad details:', error);
          }
        }

        // Get cores details
        if (launch.cores && launch.cores.length > 0) {
          try {
            const coresPromises = launch.cores.map(core => 
              core.core ? axios.get(`${BASE_URL}/cores/${core.core}`) : null
            ).filter(Boolean);
            
            if (coresPromises.length > 0) {
              const coresResponses = await Promise.all(coresPromises);
              launch.cores_details = coresResponses.map(response => response.data);
            }
          } catch (error) {
            console.log('Error fetching cores details:', error);
          }
        }

        // Get payloads details
        if (launch.payloads && launch.payloads.length > 0) {
          try {
            const payloadsPromises = launch.payloads.map(payloadId => 
              axios.get(`${BASE_URL}/payloads/${payloadId}`)
            );
            const payloadsResponses = await Promise.all(payloadsPromises);
            launch.payloads_details = payloadsResponses.map(response => response.data);
          } catch (error) {
            console.log('Error fetching payload details:', error);
          }
        }
      }

      return { data: launch };
    } catch (error) {
      console.log('Error in getLaunchById:', error);
      throw error;
    }
  },
  getHistory: () => axios.get(`${BASE_URL}/history`),
  getRoadster: () => axios.get(`${BASE_URL}/roadster`),
};