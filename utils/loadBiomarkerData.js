
export async function readBiomarkerJSONFile() {
    try {
        try {
            const response = await fetch('/NewRecordData/BiomarkerData.json');
            const jsonData = await response.json();
            return jsonData;
        } catch (error) {
            console.error('Error fetching JSON data:', error);
            return [];
        }
    } catch (error) {
      console.error('Error reading JSON file:', error);
      return [];
    }
}

