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

  function handleRemove() {
    onChange(null);
  }

  return { handleUpload, handleRemove };
}

export default useLogoUpload;
