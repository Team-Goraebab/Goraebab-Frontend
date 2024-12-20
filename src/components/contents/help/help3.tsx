'use client';

import Image from 'next/image';
import helpEx from '@/app/images/help/helpEx.png';
import Button from '@/components/button/button';

const Help3 = () => {
  return (
    <div className="py-8 px-12">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">
          Step 3: Update Your Profile
        </h3>
        <p className="text-grey_7 mb-4">
          This is a description of Whale Food. What kind of description would be
          good? The translator is really good. The world has developed a lot. I
          think we would be very happy if we won a prize in a contest.
        </p>
        <div className="flex justify-center">
          <Image
            src={helpEx}
            alt="Profile update example"
            width={340}
            height={200}
            className="rounded-md border"
          />
        </div>
      </div>
      <div className="text-center mt-8">
        <Button title={'설계도 만들러 가기'} onClick={() => {}} />
      </div>
    </div>
  );
};

export default Help3;
