import { NextPage } from "next";

interface CopyIconProps {}

const CopyIcon: NextPage<CopyIconProps> = () => {
  return (
    <p className="text-gray-500 text-md mb-4">
      &copy;2021 Acne.com by Souta Sasaki
    </p>
  );
};

export default CopyIcon;
