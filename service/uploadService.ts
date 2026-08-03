const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const uploadService = {
    uploadImages: async (files: File[]): Promise<string[]> => {
        const formData = new FormData();
        files.forEach((file) => formData.append("images", file));

        const response = await fetch(`${API_URL}/uploads/images`, {
            method: "POST",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Status: ${response.status}\n${errorText}`);
        }

        const json = await response.json();
        return json.data.urls as string[];
    },
};