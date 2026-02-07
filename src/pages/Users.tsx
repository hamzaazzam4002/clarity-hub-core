import { useState } from "react";
import { Plus, Search, Edit, UserCog, Shield, ShieldCheck, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "cashier";
  lastLogin: string;
  status: "active" | "disabled";
}

const mockUsers: User[] = [
  { id: "1", name: "John Doe", email: "john@bizmanager.com", role: "admin", lastLogin: "2024-01-15 09:30", status: "active" },
  { id: "2", name: "Sarah Wilson", email: "sarah@bizmanager.com", role: "manager", lastLogin: "2024-01-15 08:45", status: "active" },
  { id: "3", name: "Mike Johnson", email: "mike@bizmanager.com", role: "cashier", lastLogin: "2024-01-15 10:15", status: "active" },
  { id: "4", name: "Emily Brown", email: "emily@bizmanager.com", role: "manager", lastLogin: "2024-01-14 16:20", status: "active" },
  { id: "5", name: "Chris Davis", email: "chris@bizmanager.com", role: "cashier", lastLogin: "2024-01-13 14:00", status: "disabled" },
];

const roleIcons = {
  admin: ShieldAlert,
  manager: ShieldCheck,
  cashier: Shield,
};

const roleColors = {
  admin: "bg-destructive/10 text-destructive",
  manager: "bg-primary/10 text-primary",
  cashier: "bg-muted text-muted-foreground",
};

export default function Users() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddUser = () => {
    setDialogOpen(false);
    toast({
      title: "User added",
      description: "The user has been successfully added.",
    });
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === "active" ? "disabled" : "active" }
          : user
      )
    );
    toast({
      title: "Status updated",
      description: "User status has been updated.",
    });
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setDialogOpen(true);
  };

  const columns = [
    {
      key: "name",
      label: "User",
      render: (user: User) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <UserCog className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (user: User) => {
        const RoleIcon = roleIcons[user.role];
        return (
          <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${roleColors[user.role]}`}>
            <RoleIcon className="h-4 w-4" />
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </div>
        );
      },
    },
    {
      key: "lastLogin",
      label: "Last Login",
      render: (user: User) => (
        <span className="text-muted-foreground">{user.lastLogin}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (user: User) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={user.status === "active"}
            onCheckedChange={() => handleToggleStatus(user.id)}
          />
          <span className="text-sm">
            {user.status === "active" ? "Active" : "Disabled"}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (user: User) => (
        <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users & Roles"
        description="Manage user accounts and permissions"
        action={{
          label: "Add User",
          icon: Plus,
          onClick: () => {
            setEditingUser(null);
            setDialogOpen(true);
          },
        }}
      />

      {/* Role Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <ShieldAlert className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{users.filter((u) => u.role === "admin").length}</p>
              <p className="text-sm text-muted-foreground">Administrators</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{users.filter((u) => u.role === "manager").length}</p>
              <p className="text-sm text-muted-foreground">Managers</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Shield className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{users.filter((u) => u.role === "cashier").length}</p>
              <p className="text-sm text-muted-foreground">Cashiers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredUsers}
        keyExtractor={(u) => u.id}
        emptyMessage="No users found"
      />

      {/* Add/Edit User Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
            <DialogDescription>
              {editingUser ? "Update user details and permissions." : "Create a new user account."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Full Name</Label>
              <Input 
                placeholder="Enter full name" 
                defaultValue={editingUser?.name}
              />
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input 
                type="email" 
                placeholder="email@company.com"
                defaultValue={editingUser?.email}
              />
            </div>
            {!editingUser && (
              <div className="grid gap-2">
                <Label>Password</Label>
                <Input type="password" placeholder="Enter password" />
              </div>
            )}
            <div className="grid gap-2">
              <Label>Role</Label>
              <Select defaultValue={editingUser?.role || "cashier"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4" />
                      Admin
                    </div>
                  </SelectItem>
                  <SelectItem value="manager">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      Manager
                    </div>
                  </SelectItem>
                  <SelectItem value="cashier">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Cashier
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>
              {editingUser ? "Save Changes" : "Add User"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
