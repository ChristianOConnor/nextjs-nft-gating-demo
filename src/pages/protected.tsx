//@ts-ignore
import Cookies from 'cookies'
//@ts-ignore
import LitJsSdk from 'lit-js-sdk'
import type { NextPage } from 'next'
import Head from 'next/head'
import { VStack, Button, Text, Heading } from '@chakra-ui/react'
import { Unity, useUnityContext } from "react-unity-webgl";
import { baseUrl, serverBaseUrl, unityBuildPath ,testingMode} from '../constants/config';
import { useRouter } from 'next/router'
import { useEffect } from 'react'
export default function Protected(props: any) {
  const unityFileName = process.env.NEXT_PUBLIC_UNITY_APP_NAME;
 
  const { unityProvider,
    UNSAFE__detachAndUnloadImmediate: detachAndUnloadImmediate,
  } = useUnityContext({
    productName: "Christian O Connor - Unity WebGL",
    companyName: "Christian O Connor",
    dataUrl: unityBuildPath + "/" + unityFileName + ".data",
    loaderUrl: unityBuildPath + "/" + unityFileName + ".loader.js",
    frameworkUrl: unityBuildPath + "/" + unityFileName + ".framework.js",
    //codeUrl: unityBuildPath+'/"+unityFileName+".wasm',
    //codeUrl: serverBaseUrl+"/decrypt?authSig="+JSON.stringify(props.authSig), // get encrypted wasm file endpoint from express server
    codeUrl: baseUrl + "/api/decrypt?authSig=" + JSON.stringify(props.authSig), // get encrypted wasm file endpoint from next api function
    webglContextAttributes: {
      preserveDrawingBuffer: true,
    },
  });

  useEffect(() => {
    console.log('below this line is the decrypt buffer url');
    console.log("/api/decrypt?authSig="+ JSON.stringify(props.authSig));
    return () => {
      detachAndUnloadImmediate().catch((reason: any) => {
        console.log(reason);
      });
    };
  }, [detachAndUnloadImmediate]);

  if (!props.authorized) {
    return (
      <h2>Unauthorized</h2>
    )
  } else {
    return (
      <VStack>
        <h2>Unity Game</h2>
        <Text>{props?.authSig?.address}</Text>
        {unityProvider ? <Unity unityProvider={unityProvider} style={{ width: 800, height: 600 }} /> : "Loading ..."}
      </VStack>
    )
  }
}
//@ts-ignore
export async function getServerSideProps({ req, res, query }) {
  const { id,  authSig } = query
  console.log('server side props used to check the protected page:')
  console.log(JSON.stringify({
    id,
    authSig,
    baseUrl, 
    serverBaseUrl, 
    unityBuildPath,
    testingMode,
    query,
  })
  )

  const cookies = Cookies(req, res)
  const jwt = cookies.get('lit-auth')
  if (!jwt) {
    return {
      props: {
        authorized: false
      },
    }
  }

  const { verified, payload } = LitJsSdk.verifyJwt({ jwt })
  console.log('verified:')
  console.log(verified)
  console.log('payload:')
  console.log(payload)
  if (
    payload.baseUrl !== baseUrl
    || payload.path !== '/protected'
    || payload.extraData !== id
  ) {
    return {
      props: {
        authorized: false
      },
    }
  }
  
  return {
    props: {
      authorized: verified ? true : false,
      authSig: verified ? JSON.parse(authSig) : '{}',
    },
  }
}