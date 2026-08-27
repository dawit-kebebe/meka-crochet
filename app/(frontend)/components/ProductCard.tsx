
const ProductCard = () => {
    return (
        <div className="bg-creamy-bg h-full rounded-3xl transition-all duration-300 group overflow-hidden relative border border-transparent hover:border-transparent shadow-md hover:shadow-lg">
            <div className="flex flex-col h-full justify-between relative">
                <div className="h-full w-full">
                    <div className="w-full h-full overflow-hidden relative">
                        <div className="cursor-pointer w-full h-full">
                            <img src="https://picsum.photos/600/800" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" alt="Deemah Date Bars" />
                        </div>
                        <button className="absolute top-2.5 right-2.5 w-10 h-10 rounded-full flex items-center justify-center bg-primary-800 shadow-md hover:bg-primary-600 hover:scale-105 transition-all duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="w-6 h-6 text-creamy-bg">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z">
                                </path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="absolute z-1 bottom-0 inset-x-3 mb-3 p-3 rounded-[10px] shadow-sm bg-creamy-bg/50 backdrop-blur-sm flex flex-col items-start gap-0.5 cursor-pointer min-h-20">
                    <div className="inline-block bg-primary text-primary-900 px-3 py-1 rounded-[10px] my-0.5">
                        <h3 className="text-2xl font-bold leading-tight line-clamp-1 max-w-full">Deemah Date Bars</h3>
                    </div>
                    <p className="text-slate-800 text-xs font-normal truncate w-full">
                    </p>
                    <div className="flex items-center w-full">
                        <div className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon" className="w-8 h-8 text-amber-400">
                                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd"></path>
                            </svg>
                            <span className="text-primary-800 text-md font-bold">5/5</span>
                        </div>
                        <div className="ml-4 flex gap-1 items-baseline">
                            <span className="text-primary-800 font-bold text-lg">8</span>
                            <span className="text-primary-800 text-xs">sold</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <span className="text-primary-900 text-base sm:text-lg font-bold whitespace-nowrap">
                            Br 58
                        </span>
                        <div className="min-w-12 flex items-center justify-end">
                            <button className="w-10 h-10 rounded-lg bg-primary-800 text-creamy-bg flex items-center justify-center hover:bg-primary-600 transition-all shadow-sm hover:shadow-md active:scale-95">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductCard