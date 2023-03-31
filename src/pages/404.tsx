import Link from "next/link";

const Custom404 = () => {
  return (
    <>
      <h1 className="font-lg text-3xl text-fliiga-yellow">Sivua ei löydy</h1>
      <Link
        className="-mt-4 flex items-center justify-center rounded border border-fliiga-yellow bg-transparent py-2 px-6 font-medium text-white hover:border-transparent hover:bg-fliiga-yellow hover:text-white"
        href={"/"}
      >
        Palaa etusivulle
      </Link>
    </>
  );
};

export default Custom404;
