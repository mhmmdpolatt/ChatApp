import React from 'react'
import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import getUID from "../utils/getUID"; // Doğru import
import { useNavigate } from 'react-router-dom';

const Chat = () => {
    const [nickname, setNickname] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [joined, setJoined] = useState(false);
    const [aktifKullanici, setAktifKullanici] = useState([]);
    const [kullanılanNick, setKullanılanNick] = useState(false);

    const ws = useRef(null);
    const navigate = useNavigate()
    console.log("messajlar", messages);
    console.log("KULLANICILAR", aktifKullanici);

    useEffect(() => {
        // WebSocket bağlantısını başlat
        //Tokenı local storegadn al
        // const token = localStorage.getItem("token");
        // if (!token) {

        //     console.log("GİRİŞ YAPMANIZ LAZIM");
        //     return navigate("giris")


        // } else {
        //     axios.get("http://localhost:5000/verify-token", {
        //         headers: {
        //             Authorization: `Bearer ${token}`,
        //         },
        //     }).then(response => {
        //         if (response.data.valid) {
        //             // Token geçerliyse chat sayfasına devam et
        //             console.log('Token geçerli, Chat sayfasına yönlendiriliyor.');
        //         } else {
        //             // Token geçerli değilse giriş sayfasına yönlendir
        //             navigate('/giris');
        //         }
        //     })
        //         .catch(error => {
        //             console.error('Token doğrulama hatası:', error);
        //             navigate('/giris');
        //         });
        // }
        //UİD
        const uid = getUID();
        console.log("UID : ", uid);

        ws.current = new WebSocket(`ws:localhost:8080?uid=${uid}`);

        ws.current.onopen = () => {
            console.log('WebSocket bağlantısı kuruldu.');
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "error") {
                alert(data.message);
                console.log("KULLANICI HATASI", data.message)
                setKullanılanNick(true);
                return window.location.reload();
            }

            if (data.type === 'message') {
                setMessages(prev => [...prev, { nickname: data.nickname, message: data.message, type: data.type }]);
            } else if (data.type === 'notification') {
                setMessages(prev => [...prev, { message: data.message, type: data.type }]);
                console.log("type notification ///////", messages);

            } else if (data.type === 'active') {


                setAktifKullanici((prevState) => {
                    console.log("Önceki Kullanıcı Listesi:", prevState);
                    console.log("Yeni Kullanıcı Listesi:", data.users);
                    return data.users;
                });
            }
        };

        ws.current.onclose = () => {
            console.log('WebSocket bağlantısı kapandı.');
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket hatası:', error);
        };

        // Önceki mesajları al
        // axios.get('http://localhost:5000/messages')
        //     .then(response => {
        //         setMessages(response.data);
        //     })
        //     .catch(error => {
        //         console.error('Mesajları çekerken hata:', error);
        //     });

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);

    // Kullanıcı giriş yapınca çağrılır
    const handleJoin = () => {


        // Kullanıcı adı boş mu?
        if (!nickname.trim()) {
            console.log("Boş bir kullanıcı adı girilemez!");
            return;
        }

        // WebSocket bağlantısı var mı?
        if (!ws.current) {
            console.log("WebSocket bağlantısı kurulamadı!");
            return;
        }

        // Kullanıcı zaten listede mi? (Son güncellenmiş listeyi kontrol et)
        setTimeout(() => {
            if (aktifKullanici.includes(nickname)) {
                console.log("Bu kullanıcı adı zaten mevcut!");
                setKullanılanNick(true)
                setTimeout(() => {
                    setKullanılanNick(false)
                }, 3000);
            } else {
                ws.current.send(JSON.stringify({ type: 'join', nickname }));
                setJoined(true);
            }
        }, 700); // Küçük bir gecikme vererek güncellenmiş listeyi kontrol et
    };



    // Mesaj gönderme fonksiyonu
    const handleSend = () => {
        if (message.trim() && ws.current) {
            ws.current.send(JSON.stringify({ type: 'message', message }));
            setMessage('');
        }
    };



    const handleLeaveChat = () => {
        ws.current.close();
        window.location.reload();
    }

    const currentUser = messages.filter((msg) => msg.nickname == nickname);
    console.log("Mesaj Sahibi", currentUser);




    return (

        <>

            <div className="flex flex-col justify-center items-center p-8  min-h-screen">

                <h1 className="text-3xl font-semibold mb-6 text-center text-gray-100">Sohbet Uygulaması</h1>

                {!joined ? (
                    <div className="flex flex-col items-center">
                        <input
                            type="text"
                            placeholder="Adınızı girin"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleJoin(); // Enter tuşuna basıldığında mesaj gönder
                                }
                            }}
                            className="mb-4 p-3 rounded-md border border-gray-300 text-white focus:outline-none "
                        />

                        <button
                            onClick={handleJoin}
                            className="p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                        >
                            Katıl
                        </button>
                        <div className='mt-5'>
                            {kullanılanNick ? (<p className='bg-red-500 text-white px-2.5 py-1.5'>Bu Kullanıcı Adı Zaten Mevcut Farklı Bir İsim Dene</p>) : (null)}
                        </div>


                    </div>
                ) : (
                    <div className="flex flex-col items-center w-full max-w-lg">
                        <h1 className='p-1 text-white'>Buraya <strong>{nickname}</strong> Olarak Katıldın</h1>
                        <div className="h-80 w-full overflow-y-scroll border border-gray-300 p-4 mb-4 rounded-md shadow-md bg-white">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.type === "message" && msg.nickname === nickname
                                        ? 'justify-end'  // Eğer type "message" ve nickname eşleşiyorsa sağa yerleştir
                                        : msg.type !== "message"
                                            ? 'justify-center'  // Eğer type "message" değilse ortala
                                            : 'justify-start'   // Diğer durumda sola yerleştir
                                        }`}
                                >

                                    <div
                                        className={`p-2 flex gap-x-1.5 mt-2 rounded-md shadow-md max-w-xs ${msg.nickname === nickname
                                            ? 'bg-blue-500 text-white '  // Kullanıcının mesajı sağda ve mavi
                                            : 'bg-gray-200 text-black'

                                            // Diğer mesajlar solda ve gri
                                            }

                                            `}
                                    >
                                        {msg.nickname && (
                                            <strong className={`${msg.nickname === nickname ? "hidden" : "block"}`}>{msg.nickname} : </strong>
                                        )}
                                        <span className={`${msg.type === "notification" ? "bg-none" : ""}`}>{msg.message}</span>
                                    </div>
                                </div>
                            ))}
                        </div>



                        <div className="flex items-center w-full">
                            <input
                                type="text"
                                placeholder="Mesajınızı yazın"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSend(); // Enter tuşuna basıldığında mesaj gönder
                                    }
                                }}
                                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none mr-2 text-white"
                            />
                            <button
                                onClick={handleSend}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSend(); // Enter tuşuna basıldığında mesaj gönder
                                    }
                                }}

                                className="p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                            >
                                Gönder
                            </button>
                            <button onClick={handleLeaveChat} className="p-3 bg-slate-800 ml-2 text-white rounded-md hover:bg-blue-600 transition duration-200 text-nowrap">Sohbetten Çık</button>
                        </div>
                        <div>
                            <h1 className='text-white text-2xl text-center mb-5'>Şuan Sohbet Odasında Bulunanlar : {aktifKullanici.length}</h1>
                            <div className='bg-white p-3 '>
                                {aktifKullanici.map((a, index) => {
                                    return <h1 className='text-gray-800' key={index}>{a}</h1>;  // return ekleyerek öğeyi döndür
                                })}
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default Chat