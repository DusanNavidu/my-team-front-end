import { useEffect, useState, useCallback } from "react";
import { 
  getAllOrganizers, 
  getAllPlayers, 
  getAllUsers, 
  updateUser, 
  changeUserStatus,
  getAllUsersByRole,
  getAllActiveUsers,
  getAllDeactivatedUsers,
  getAllUsersCount,
  type UserData, 
  getAllOrganizersCount,
  getAllPlayersCount,
  getAllActiveUsersCount,
  getAllDeactivatedUsersCount,
  searchUsers,
  getAllUsersByRoleCount,
} from "../../service/auth";
import Table from "../../components/Table";
import Button from "../../components/Button";
import Modal from "../../components/Modal/Modal";
import Input from "../../components/Modal/InputForModal";

export default function AdminUsersManage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentFilter, setCurrentFilter] = useState("ALL"); 

  const [totalUsersCount, setTotalUsersCount] = useState<number>(0);
  const [totalOrganizersCount, setTotalOrganizersCount] = useState<number>(0);
  const [totalPlayersCount, setTotalPlayersCount] = useState<number>(0);
  const [totalUsersByRoleCount, setTotalUsersByRoleCount] = useState<number>(0);
  const [totalActiveUsersCount, setTotalActiveUsersCount] = useState<number>(0);
  const [totalDeactivatedUsersCount, setTotalDeactivatedUsersCount] = useState<number>(0);

  const [searchQuery, setSearchQuery] = useState("");

  const loadData = useCallback(async (page: number, filter: string, query: string) => {
    setLoading(true);
    try {
      let res;
      if (query.trim()) {
        res = await searchUsers(query, page);
      } else {
        switch (filter) {
          case "ORGANIZER":
            res = await getAllOrganizers(page);
            break;
          case "PLAYER":
            res = await getAllPlayers(page);
            break;
          case "USERS":
            res = await getAllUsersByRole(page);
            break;
          case "ACTIVE":
            res = await getAllActiveUsers(page);
            break;
          case "DEACTIVATED":
            res = await getAllDeactivatedUsers(page);
            break;
          default:
            res = await getAllUsers(page);
        }
      }
      
      setUsers(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (error) {
      console.error(`Failed to load data:`, error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCounts = useCallback(async () => {
    try {
      const [all, org, play, role, active, deactive] = await Promise.all([
        getAllUsersCount(),
        getAllOrganizersCount(),
        getAllPlayersCount(),
        getAllUsersByRoleCount(),
        getAllActiveUsersCount(),
        getAllDeactivatedUsersCount()
      ]);
      setTotalUsersCount(all);
      setTotalOrganizersCount(org);
      setTotalPlayersCount(play);
      setTotalUsersByRoleCount(role);
      setTotalActiveUsersCount(active);
      setTotalDeactivatedUsersCount(deactive);
    } catch (error) {
      console.error("Failed to fetch counts", error);
    }
  }, []);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  useEffect(() => {
    loadData(currentPage, currentFilter, searchQuery);
  }, [currentPage, currentFilter, searchQuery, loadData]);

  const handleFilterChange = (filter: string) => {
    setSearchQuery("");
    setCurrentFilter(filter);
    setCurrentPage(1);
  };

  const handleSearchInput = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(undefined, {
      year: "numeric", month: "long", day: "numeric",
      hour: "numeric", minute: "numeric", hour12: true,
    });
  };

  const isActive = (user: UserData) => user.status === "ACTIVE";

  const openEditModal = (user: UserData) => {
    setSelectedUser(user);
    setFullname(user.fullname);
    setEmail(user.email);
    setIsModalOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    try {
      await updateUser(selectedUser._id, { fullname, email });
      setIsModalOpen(false);
      loadData(currentPage, currentFilter, searchQuery);
    } catch (error) {
      alert("Update failed");
    }
  };

  const handleToggleStatus = async (user: UserData) => {
    try {
      await changeUserStatus(user._id);
      loadData(currentPage, currentFilter, searchQuery);
      fetchCounts();
    } catch (error) {
      alert("Status change failed");
    }
  };

  return (
    <div className="pt-8 pb-10 px-6 sm:px-10 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Users</h1>

      <div className="flex items-center gap-4 mb-6">
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => handleSearchInput(e.target.value)} 
          className="w-full border rounded-2xl px-4 py-2" 
          placeholder="Search by name or email"
        />

        <div className="flex gap-4">
          <Button color="blue" className="w-50">Add New User +</Button>
          <Button color="orange" className="w-55">Add New Admin +</Button>
        </div>
      </div>

      <div className="flex gap-3 justify-end mb-4 flex-wrap">
        <Button color="darkBlue" onClick={() => handleFilterChange("ALL")}>
          All Users
          <span className="bg-white text-gray-800 ml-2 px-2 py-1 rounded-full text-sm font-medium">
            +{totalUsersCount}
          </span>
        </Button>
        <Button color="darkBlue" onClick={() => handleFilterChange("ORGANIZER")}>
          Organizers
          <span className="bg-white text-gray-800 ml-2 px-2 py-1 rounded-full text-sm font-medium">
            +{totalOrganizersCount}
          </span>
        </Button>
        <Button color="darkBlue" onClick={() => handleFilterChange("PLAYER")}>
          Players
          <span className="bg-white text-gray-800 ml-2 px-2 py-1 rounded-full text-sm font-medium">
            +{totalPlayersCount}
          </span>
        </Button>
        <Button color="darkBlue" onClick={() => handleFilterChange("USERS")}>
          Users
          <span className="bg-white text-gray-800 ml-2 px-2 py-1 rounded-full text-sm font-medium">
            +{totalUsersByRoleCount}
          </span>
        </Button>
        <Button color="green" onClick={() => handleFilterChange("ACTIVE")}>
          Active
          <span className="bg-white text-gray-800 ml-2 px-2 py-1 rounded-full text-sm font-medium">
            +{totalActiveUsersCount}
          </span>
        </Button>
        <Button color="red" onClick={() => handleFilterChange("DEACTIVATED")}>
          Deactivated
          <span className="bg-white text-gray-800 ml-2 px-2 py-1 rounded-full text-sm font-medium">
            +{totalDeactivatedUsersCount}
          </span>
        </Button>
      </div>

      {loading ? (
        <p className="text-gray-600 text-center py-10">Loading users...</p>
      ) : (
        <>
          <Table<UserData>
            data={users}
            columns={[
              {
                label: "ID",
                render: (_, index) => (currentPage - 1) * 20 + (index + 1),
              },
              { label: "Fullname", key: "fullname" },
              { label: "Email", key: "email" },
              {
                label: "Role",
                render: (row) => (
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase">
                    {row.roles.join(", ")}
                  </span>
                ),
              },
              {
                label: "Created At",
                render: (row) => formatDate(row.createdAt),
              },
              {
                label: "Update At",
                render: (row) => formatDate(row.updatedAt),
              },
              {
                label: "Actions",
                align: "center",
                render: (row) => (
                  <div className="flex gap-2 justify-center">
                    <Button
                      color="yellow"
                      className="px-3 py-1 text-sm w-25"
                      onClick={() => openEditModal(row)}
                    >
                      Edit
                    </Button>
                    <Button
                      color={isActive(row) ? "red" : "green"}
                      className="px-3 py-1 text-sm w-25"
                      onClick={() => handleToggleStatus(row)}
                    >
                      {isActive(row) ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                ),
              },
            ]}
          />

          <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white border-t border-gray-200 sm:px-6 rounded-lg shadow-sm">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  color="gray"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Previous
                </Button>
                <Button
                  color="gray"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Update {selectedUser?.fullname}</h2>
        <Input label="Full Name" value={fullname} onChange={(e) => setFullname(e.target.value)} />
        <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="flex justify-end gap-3 mt-6">
          <Button color="gray" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button color="blue" onClick={handleUpdateUser}>Save Changes</Button>
        </div>
      </Modal>
    </div>
  );
}