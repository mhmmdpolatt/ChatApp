import React from 'react'

const Home = () => {
  return (
    
      <div className='flex flex-col justify-center items-center h-[100vh]'>
        <h1 className='text-white text-3xl'>ChattApp'e Hoşgeldin Hemen Sohbet Odasına Katıl Ve Konuşmaya Başla</h1> <br />
        <button className='bg-blue-600 text-2xl p-5 text-white rounded-4xl hover:bg-blue-700'><a href="/chat">Başla</a></button>
      </div>
    
  )
}

export default Home