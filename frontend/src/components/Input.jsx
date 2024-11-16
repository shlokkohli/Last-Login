import React from 'react'

function Input({icon: Icon, type, placeholder, value, onChange}) {
  return (
    <div className='relative mb-6 mx-auto'>

        <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
            <Icon className='size-5 text-green-500' />
        </div>

        <input
        className='w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200'
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        />

    </div>
  )
}

export default Input