import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Edit, UserCog, Shield, ShieldCheck, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { usersApi, type User } from "@/lib/api";

const roleIcons = { admin: ShieldAlert, manager: ShieldCheck, cashier: Shield };
const roleColors = { admin: "bg-destructive/10 text-destructive", manager: "bg-primary/10 text-primary", cashier: "bg-muted text-muted-foreground" };

export default function Users() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "cashier" });

  const { data: users = [], isLoading } = useQuery({ queryKey: ["users"], queryFn: usersApi.list });

  const createMutation = useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["users"] }); setDialogOpen(false); toast({ title: "User added" }); },
    onError: (err: Error) => toast({ variant: "destructive", title: "Error", description: err.message }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => usersApi.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["users"] }); setDialogOpen(false); toast({ title: "User updated" }); },
    onError: (err: Error) => toast({ variant: "destructive", title: "Error", description: err.message }),
  });

  const filteredUsers = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const handleToggleStatus = (user: User) => {
    updateMutation.mutate({ id: user.id, data: { isActive: !user.isActive } });
  };

  const handleSubmit = () => {
    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, data: { name: formData.name, email: formData.email, role: formData.role, ...(formData.password ? { password: formData.password } : {}) } });
    } else {
      createMutation.mutate({ name: formData.name, email: formData.email, password: formData.password, role: formData.role });
    }
  };

  const openEdit = (user: User) => { setEditingUser(user); setFormData({ name: user.name, email: user.email, password: "", role: user.role }); setDialogOpen(true); };
  const openAdd = () => { setEditingUser(null); setFormData({ name: "", email: "", password: "", role: "cashier" }); setDialogOpen(true); };

  const columns = [
    {
      key: "name", label: "User",
      render: (user: User) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"><UserCog className="h-5 w-5 text-primary" /></div>
          <div><p className="font-medium">{user.name}</p><p className="text-sm text-muted-foreground">{user.email}</p></div>
        </div>
      ),
    },
    {
      key: "role", label: "Role",
      render: (user: User) => {
        const RoleIcon = roleIcons[user.role];
        return (
          <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${roleColors[user.role]}`}>
            <RoleIcon className="h-4 w-4" />{user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </div>
        );
      },
    },
    {
      key: "status", label: "Status",
      render: (user: User) => (
        <div className="flex items-center gap-2">
          <Switch checked={user.isActive} onCheckedChange={() => handleToggleStatus(user)} />
          <span className="text-sm">{user.isActive ? "Active" : "Disabled"}</span>
        </div>
      ),
    },
    {
      key: "actions", label: "",
      render: (user: User) => <Button variant="ghost" size="sm" onClick={() => openEdit(user)}><Edit className="mr-2 h-4 w-4" />Edit</Button>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Users & Roles" description="Manage user accounts and permissions" action={{ label: "Add User", icon: Plus, onClick: openAdd }} />

      <div className="grid gap-4 sm:grid-cols-3">
        {(["admin", "manager", "cashier"] as const).map((role) => {
          const Icon = roleIcons[role];
          return (
            <div key={role} className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${roleColors[role]}`}><Icon className="h-5 w-5" /></div>
                <div><p className="text-2xl font-bold">{users.filter((u) => u.role === role).length}</p><p className="text-sm text-muted-foreground capitalize">{role}s</p></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      <DataTable columns={columns} data={filteredUsers} keyExtractor={(u) => u.id} emptyMessage={isLoading ? "Loading..." : "No users found"} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
            <DialogDescription>{editingUser ? "Update user details." : "Create a new user account."}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Full Name</Label><Input placeholder="Enter full name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Email</Label><Input type="email" placeholder="email@company.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Password{editingUser ? " (leave blank to keep)" : ""}</Label><Input type="password" placeholder="Enter password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} /></div>
            <div className="grid gap-2">
              <Label>Role</Label>
              <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin"><div className="flex items-center gap-2"><ShieldAlert className="h-4 w-4" />Admin</div></SelectItem>
                  <SelectItem value="manager"><div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" />Manager</div></SelectItem>
                  <SelectItem value="cashier"><div className="flex items-center gap-2"><Shield className="h-4 w-4" />Cashier</div></SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
              {editingUser ? "Save Changes" : "Add User"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
