"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Trash2 } from "lucide-react";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("repartidor");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const API_BASE_URL = "";

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch(`/api/users`);
      if (!res.ok) throw new Error("Error usuarios");
      const data = await res.json();
      setUsers(data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    try {
      const res = await fetch(`/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      if (!res.ok) throw new Error("Error crear");
      setName(""); setEmail(""); setPassword(""); setRole("repartidor");
      await fetchUsers();
    } catch (e) {}
  }

  async function handleRoleChange(id, newRole) {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error("Error rol");
      await fetchUsers();
    } catch (e) {}
  }

  async function handleDelete(id) {
    const ok = window.confirm("¿Eliminar este usuario?");
    if (!ok) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) throw new Error("Error eliminar");
      await fetchUsers();
    } catch (e) {}
  }

  function startEdit(u) {
    setEditingId(u._id);
    setEditName(u.name || "");
    setEditEmail(u.email || "");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditEmail("");
  }

  async function saveEdit() {
    if (!editingId) return;
    try {
      const res = await fetch(`/api/users/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, email: editEmail }),
      });
      if (!res.ok) throw new Error("Error editar");
      cancelEdit();
      await fetchUsers();
    } catch (e) {}
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl">
              <User className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Usuarios</h1>
          </div>
          <button onClick={() => router.push("/admin")} className="px-4 py-2 rounded-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-100">Volver</button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Nombre" className="px-3 py-2 border rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700" />
            <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="px-3 py-2 border rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700" />
            <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Contraseña" className="px-3 py-2 border rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700" />
            <select value={role} onChange={(e)=>setRole(e.target.value)} className="px-3 py-2 border rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700">
              <option value="repartidor">Repartidor</option>
              <option value="admin">Admin</option>
              <option value="user">Usuario</option>
            </select>
            <button type="submit" className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white">Crear</button>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          {loading ? (
            <div className="text-gray-600 dark:text-gray-300">Cargando…</div>
          ) : users.length === 0 ? (
            <div className="text-gray-600 dark:text-gray-300">Sin usuarios</div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map(u => (
                <div key={u._id} className="flex items-center justify-between py-3">
                  <div className="flex-1">
                    {editingId === u._id ? (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input value={editName} onChange={(e)=>setEditName(e.target.value)} placeholder="Nombre" className="px-3 py-2 border rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700" />
                        <input value={editEmail} onChange={(e)=>setEditEmail(e.target.value)} placeholder="Email" className="px-3 py-2 border rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700" />
                      </div>
                    ) : (
                      <>
                        <div className="font-medium text-gray-900 dark:text-white">{u.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{u.email}</div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <select value={u.role} onChange={(e)=>handleRoleChange(u._id, e.target.value)} className="px-3 py-2 border rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700">
                      <option value="repartidor">Repartidor</option>
                      <option value="admin">Admin</option>
                      <option value="user">Usuario</option>
                    </select>
                    {editingId === u._id ? (
                      <>
                        <button onClick={saveEdit} className="px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white">Guardar</button>
                        <button onClick={cancelEdit} className="px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100">Cancelar</button>
                      </>
                    ) : (
                      <button onClick={()=>startEdit(u)} className="px-3 py-2 rounded-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100">Editar</button>
                    )}
                    <button onClick={()=>handleDelete(u._id)} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white">
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
