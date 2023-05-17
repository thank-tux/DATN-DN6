import axios from "axios";

const API_Location = `https://api.bigdatacloud.net/data/reverse-geocode-client?`;
// const API_Key = `d550366b3e6152d7eb818783a7958475`;
const getLocation = async (location) => {
  const LINK = `${API_Location}latitude=${location.lat}&longitude=${location.lon}&localityLanguage=en`;

  const response = await axios.get(LINK);
  return response.data;
};

export const getPosition = async () => {
  let result = null,
    error = null;
  try {
    const hehe = navigator.geolocation.getCurrentPosition(
      async (position) => {
        const newPosition = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        const data = await getLocation(newPosition);
        result = `${data.locality} ${data.city} ${data.countryName}`;
        // console.log(result);
        return result;
      },
      (e) => {
        error = e;
      }
    );
    console.log(hehe);
  } catch (e) {
    error = "Định vị không được sử dụng ở trang web này";
  }
  console.log(result);
  return { result, error };
};
