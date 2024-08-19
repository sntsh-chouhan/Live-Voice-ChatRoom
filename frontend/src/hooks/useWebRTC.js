import { useCallback, useEffect, useRef, useState } from 'react';
import { useStateWithCallback } from './useStateWithCallback';
import socketInit from '../socket';
import { ACTIONS } from '../actions';
import freeice from 'freeice';

export const useWebRTC = (roomId, user) => {
    const [clients, setClients] = useStateWithCallback([]);

    const audioElements = useRef({});
    const connections = useRef({});
    const localMediaStream = useRef(null);
    const socket = useRef(null);

    const addNewClient = useCallback(
        (newClient, cb) => {
            const lookingFor = clients.find(
                (client) => client.id === newClient.id
            );

            console.log('clients', clients, lookingFor);
            if (!lookingFor) {
                setClients(
                    (existingClients) => [...existingClients, newClient],
                    cb
                );
            }
        },
        [clients, setClients]
    );

    useEffect(()=>{
        socket.current=socketInit();
    }, [])

    // capturing audio from device
    useEffect(()=>{
        const startCapture = async ()=>{
            try {
                localMediaStream.current = 
                    await navigator.mediaDevices.getUserMedia({
                        audio: true,
                    });
            } catch (err) {
                console.error("Error capturing audio", err);
                return;
            }
        };

        startCapture().then(()=>{
            if (localMediaStream.current) {
                addNewClient(user, () => {
                    const localElement = audioElements.current[user.id];
    
                    if (localElement) {
                        localElement.volume = 0;
                        localElement.srcObject = localMediaStream.current;
                    }
    
                    socket.current.emit(ACTIONS.JOIN, { roomId, user, });
                });
            }
        });

        return () => {
            if (localMediaStream.current) {
                localMediaStream.current
                    .getTracks()
                    .forEach((track) => track.stop());
            }
            socket.current.emit(ACTIONS.LEAVE, { roomId });
        };
        
    }, []);

    useEffect(()=>{
        const handleNewPeer = async ({peerId, createOffer, user: remoteUser}) =>{
            // if already connected, give warning
            if(peerId in connections.current){
                return console.warn(`you are already connected with ${peerId} (${user.name})`);
            }

            connections.current[peerId] = new RTCPeerConnection({
                iceServers: freeice()
            });

            // handle new ice candidate
            connections.current[peerId].onicecandidate = (event)=>{
                socket.current.emit(ACTIONS.RELAY_ICE, {
                    peerId,
                    icecandidate: event.candidate
                })
            }
            // handle on track on this connection
            connections.current[peerId].ontrack = ({
                streams: [remoteStreame]
            })=>{
                 addNewClient(remoteUser, ()=>{
                    if(audioElements.current[remoteUser.id]){
                        audioElements.current[remoteUser.id].srcObject = remoteStreame
                    }else{
                        let settled = false;
                        const interval = setInterval(() => {
                            if(audioElements.current[remoteUser.id]){
                                audioElements.current[remoteUser.id].srcObject = remoteStreame
                                settled = true;
                            }
                            if(settled){
                                clearInterval(interval);
                            }
                        }, 1000);
                    }
                 })
            };

            // add local track to remote connections
            if (localMediaStream.current) { // Added: Null check for localMediaStream.
                localMediaStream.current.getTracks().forEach((track) => {
                    connections.current[peerId].addTrack(track, localMediaStream.current);
                });
            }
            // create offer
            if(createOffer){
                const offer = await connections.current[peerId].createOffer();
                
                await connections.current[peerId].setLocalDescription(offer);

                socket.current.emit(ACTIONS.RELAY_SDP, {
                    peerId,
                    sessionDescription: offer
                })
            }
        };

        socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);

        return() =>{
            socket.current.off(ACTIONS)
        }
    }, []);

    // handle ice candidate
    useEffect(()=>{
        socket.current.on(ACTIONS.ICE_CANDIDATE, ({peerId, icecandidate}) =>{
            if(icecandidate){
                connections.current[peerId].addNewClient(icecandidate);
            }
        })

        return ()=>{
            socket.current.off(ACTIONS.ICE_CANDIDATE);
        }
    }, []);

    // handle sdp
    useEffect(()=>{
        const handelRemoteSdp = async ({peerId, sessionDescription: remoteSessionDescription}) =>{
            connections.current[peerId].setRemoteDescription(
                new RTCSessionDescription(remoteSessionDescription)
            )

            // if session description is type of offer then create an answer

            if(remoteSessionDescription.type === 'offer'){
                const connection = connections.current[peerId];
                const answer = await connection.createAnswer();

                connection.setLocalDescription(answer);

                socket.current.emit(ACTIONS.ICE_CANDIDATE, {
                    peerId,
                    sessionDescription: answer,
                })
            }

        }

        socket.current.on(ACTIONS.SESSION_DESCRIPTION, handelRemoteSdp)

        return () =>{
            socket.current.off(ACTIONS.SESSION_DESCRIPTION);
        }
    }, []);

    // handle remove peer
    useEffect(()=>{
        const handelRemovePeer = async({peerId, userId}) => {
            if(connections.current[peerId]){
                connections.current[peerId].close();
            }

            delete connections.current[peerId];
            delete audioElements.current[peerId];

            setClients(list => list.filter(client => client.id !== userId));
        };

        socket.current.on(ACTIONS.REMOVE_PEER, handelRemovePeer);

        return () =>{
            socket.current.off(ACTIONS.REMOVE_PEER);
        }
    }, [])

    const provideRef = (instance, userId) =>{
        audioElements.current[userId] = instance;
    };

    return {clients, provideRef};
}