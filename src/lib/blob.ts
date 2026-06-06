import { put, del } from '@vercel/blob';

export async function uploadToBlob(
  file: File,
  folder: string
): Promise<{ url: string; pathname: string }> {
  const filename = `${folder}/${Date.now()}-${file.name}`;
  const blob = await put(filename, file, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return { url: blob.url, pathname: blob.pathname };
}

export async function deleteFromBlob(url: string): Promise<void> {
  await del(url, { token: process.env.BLOB_READ_WRITE_TOKEN });
}
