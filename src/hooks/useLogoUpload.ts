function useLogoUpload(onChange: (base64: string | null) => void) {
  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function handleUrlImport(url: string) {
    try {
      const response = await fetch(url);

      if (!response.ok) throw new Error("Failed to fetch image");

      const blob = await response.blob();

      // Validate it's actually an image
      if (!blob.type.startsWith("image/")) {
        throw new Error("URL does not point to a valid image");
      }

      const reader = new FileReader();
      reader.onload = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Could not load image from URL",
      );
    }
  }

  function handleRemove() {
    onChange(null);
  }

  return { handleUpload, handleUrlImport, handleRemove };
}

export default useLogoUpload;
