export async function fetchProtectedData() {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:8080/protected", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.json();
}
