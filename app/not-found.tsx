import { FC } from "react";
import Image from "next/image";
import Link from "next/link";

const Error404: FC = () => {
  return (
    <div className="text-center justify-center ">
      <h1 className="mt-2 _text-4xl _font-bold _tracking-tight _text-slate-900 dark:_text-slate-100">
        Error 404: Página no encontrada
      </h1>
      <p className=" text-center justify-center text-2xl font-extrabold text-lime-400">
        Lo sentimos, la página que estás buscando no existe.
      </p>
      <br />
      
      <button className="text-2xl font-extrabold text-blue-400 justify-center">
        <Link href="/">Volver al inicio </Link>
      </button>
      <Image
        src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2Z5NHI3b3N6bWJpbTE0d3hlZm1zc3k3NHNlcXgwaGl1NjR1Z3VleSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2vs70gBAfQXvOOYsBI/giphy.gif"
        alt="Confused Travolta"
        width={300} // Add this
        height={225} // Add this (assuming a 4:3 aspect ratio, adjust as needed)
        className="mx-auto my-32 rounded-md w-[300px] h-auto"
        unoptimized
        priority
      />
    </div>
  );
};

export default Error404;
