import { AddMajorWithRelations } from "@/types/major"
import Image from 'next/image';

type Props = {
    major: AddMajorWithRelations;
}

export default function AddMajorClient({ major } : Props) {
  return (
    <div>
        {/* Hero */}
        <div className="relative h-[400px] w-full">
        <Image
            id="top"
            src="/images/add_major_banner.jpg"
            fill={true}
            alt="CPP campus"
            loading="eager"
            style={{ objectFit: "cover" }}
        />

        <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/50 to-black"></div>
            <span className='absolute w-full bottom-6 md:bottom-8 text-white'>
                <div className="text-center md:text-left">
                    <div className="w-10/12 mx-auto md:flex md:justify-between md:items-center space-y-4">
                        <h1 className="text-2xl md:text-4xl font-bold w-full md:w-10/12 ml-0 mb-0 items-center">{major.name}</h1>
                    </div>
                </div>
            </span>
        </div>
    </div>
  )
}
