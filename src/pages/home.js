import React, { useEffect } from 'react'
import SpotifyWebApi from 'spotify-web-api-node';
import useAuth from '../components/useAuth';


const spotifyApi = new SpotifyWebApi({
  clientId: "6d45003bbeb748c2b3140ffb5c7c6626",
})

export default function Home({ code }) {

  const accessToken = useAuth(code);

  useEffect(() => {
    if (!accessToken) return
    console.log(accessToken);
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])


  
  return (
    <div>Home</div>
  )
}
