'use client'

import React from "react"

const LoadingSpinner= () => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-10 z-50 flex justify-center items-center">
            <div className=" w-16 h-16 border-t-4 border-blue-700 border-solid rounded-full animate-spin">
            </div>
            <p className="ml-4 text-blue-700">Carregando...</p>
        </div>
    )
}
export default LoadingSpinner