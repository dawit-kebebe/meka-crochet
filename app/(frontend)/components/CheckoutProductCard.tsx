import React from 'react'

const CheckoutProductCard = () => {
    return (
        <div className="bg-creamy-bg h-full rounded-3xl transition-all duration-300 group overflow-hidden relative border border-transparent hover:border-transparent shadow-md hover:shadow-lg">
            <div className="flex flex-col h-full justify-between relative">
                <div className="h-full w-full">
                    <div className="w-full h-full overflow-hidden relative">
                        <div className="cursor-pointer w-full h-full">
                            <img src="https://picsum.photos/600/800" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" alt="Deemah Date Bars" />
                        </div>
                        <div className="absolute top-2.5 right-2.5 flex items-center justify-center w-fit py-1 px-3 rounded-xl bg-primary-800 text-creamy-bg">
                            &#215; 200
                        </div>
                    </div>
                </div>
                <div className="absolute z-1 bottom-0 inset-x-3 mb-3 p-3 rounded-[10px] shadow-sm bg-creamy-bg/50 backdrop-blur-sm flex flex-col items-start gap-0.5 cursor-pointer min-h-20">

                    <h3 className="text-2xl font-bold leading-tight line-clamp-1 max-w-full">Deemah Date Bars</h3>
                    <p className="line-clamp-2 text-slate-800 text-sm font-normal truncate w-full">
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellat, dignissimos maxime eaque neque doloribus iure nulla eveniet cum, laboriosam ut debitis. Est repellat a libero corporis ratione animi voluptatibus ipsam.
                    </p>

                    <div className="flex items-center justify-between w-full">
                        <span className="text-primary-900 text-base sm:text-lg font-bold whitespace-nowrap">
                            Total: 400 Br
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckoutProductCard