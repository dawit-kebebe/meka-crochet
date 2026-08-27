"use client";

import { Button } from 'flowbite-react'
import React, { useEffect, useState } from 'react'

interface SizeSelectorProps {
    sizes: string[],
    onSelectedSize: (size: string) => void,
    defaultSize?: string,
}

const SizeSelector = ({ sizes, onSelectedSize, defaultSize }: SizeSelectorProps) => {

    const [selectedSize, setSelectedSize] = useState<string>(defaultSize || "");

    useEffect(() => {
        if (defaultSize) {
            onSelectedSize(defaultSize);
        }
    }, [defaultSize, onSelectedSize]);

    const handleSelectSize = (size: string) => {
        setSelectedSize(size);
        onSelectedSize(size);
    }

    return (
        <div className='flex items-center gap-4 text-primary-800 mt-4'>
            <span className='text-2xl'>
                Size
            </span>
            {
                sizes.map((size, index) => (
                    <Button key={index} onClick={() => handleSelectSize(size)}  className={` border-none rounded-full p-2 md:p-4 w-10 h-10 text-md cursor-pointer ${size === selectedSize ? 'bg-primary-900!' : ''}`}>
                        {size}
                    </Button>
                ))
            }
        </div>
    )
}

export default SizeSelector