export interface satelliteFields {
    satellite_id: number,
    title: string,
    orbit: string,
    expected_date: string,
    description: string,
    weight: number,
    image_url: string,
    status: boolean,
    full_desc: string,
}

export interface satelliteResult {
    satellites: satelliteFields[],
}

export const getSatellitesByName = async (name = ''): Promise<satelliteResult> => {
    try {
        //const response = await fetch(`http://localhost:8000/satellites?SatelliteTitle=${encodeURIComponent(name)}`);
        const response = await fetch(`/api/satellites/?SatelliteTitle=${(name)}`);
        if (!response.ok) {
            const text = await response.text();
            console.error("Error fetching satellites:", response.status, response.statusText);
            console.error("Response text:", text);
            throw new Error(`Error fetching satellites: ${response.statusText}`);
        }
        const data = await response.json();
        return {
            satellites: data.satellites || [],
        };
    } catch (error) {
        console.error("Error fetching satellites by name:", error);
        throw error;
    }
};

export const getSatelliteById = async (satellite_id: number | string): Promise<satelliteFields> => {
    try {
        //const response = await fetch(`http://localhost:8000/satellites/${satellite_id}`);
        const response = await fetch(`/api/satellites/${satellite_id}`);
        if (!response.ok) {
            const text = await response.text();
            console.error("Error fetching satellite by ID:", response.status, response.statusText);
            console.error("Response text:", text);
            throw new Error(`Error fetching satellite: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching satellite by ID:", error);
        throw error;
    }
};