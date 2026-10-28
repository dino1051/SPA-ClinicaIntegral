import { useEffect, useRef, useState } from "react";
import { Camera, UserRound } from "lucide-react";
import toast from "react-hot-toast";

interface InputFotoPerfilProps {
  fotoActual: string | null;
  onChange: (archivo: File | null) => void;
}

export default function InputFotoPerfil({
  fotoActual,
  onChange,
}: InputFotoPerfilProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleSeleccion = (event: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0];

    if (!archivo) return;

    if (!archivo.type.startsWith("image/")) {
      toast.error("El archivo debe ser una imagen.");
      event.target.value = "";
      return;
    }

    if (archivo.size > 5 * 1024 * 1024) {
      toast.error("La imagen no puede superar los 5 MB.");
      event.target.value = "";
      return;
    }

    const nuevaPreview = URL.createObjectURL(archivo);

    setPreview(nuevaPreview);
    onChange(archivo);
  };

  const imagen = preview ?? fotoActual;

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-md"
        aria-label="Cambiar foto de perfil"
      >
        {imagen ? (
          <img
            src={imagen}
            alt="Foto de perfil"
            className="h-full w-full object-cover"
          />
        ) : (
          <UserRound className="mx-auto h-16 w-16 text-slate-400" />
        )}

        <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100">
          <Camera className="h-7 w-7" />
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleSeleccion}
      />

      <p className="text-sm text-slate-500">
        Haz clic en la foto para cambiarla
      </p>

      <p className="text-xs text-slate-400">Formatos de imagen · Máximo 5 MB</p>
    </div>
  );
}
