import React from 'react'

const TextToImage = () => {
  return (
    <div className='bg-[#00101d] p-4 text-white font-[Helvetica] h-screen w-screen  flex flex-col items-center justify-start md:justify-start '>
        <div className='p-4  flex flex-col items-center justify-center gap-8 w-full h-4/5 md:w-4/5'>
        <h1 className='text-4xl font-[100] text-amber-100 text-center'><span className='text-blue-400'>Text to Image </span> generator will be available in <span className='text-green-400'>next update. </span></h1>
        <p className='text-2xl  font-[] text-justify'> It was planned to use Google's gemini text to image generation API for this feature initially but unfortunately it was <strong className='text-amber-400'>paid subscription </strong>based then we tried with OpenAI, same thing. So, this feature will be available in the next version of the project.</p>
        </div>
    </div>
  )
}

export default TextToImage