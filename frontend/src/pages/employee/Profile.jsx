import { KeyRound, LoaderCircle, Save, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { changePassword } from "../../services/authService";
import "./Profile.css";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [fullName, setFullName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  useEffect(() => setFullName(user?.full_name || ""), [user?.full_name]);
  const initials = useMemo(() => (user?.full_name || "User").split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase(), [user?.full_name]);

  const saveProfile = async (event) => {
    event.preventDefault();
    const cleanName = fullName.trim();
    if (cleanName.length < 2) return toast.error("Please enter your full name.");
    try {
      setSavingProfile(true);
      await updateProfile({ full_name: cleanName });
      toast.success("Your name has been updated.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not update your profile.");
    } finally { setSavingProfile(false); }
  };

  const savePassword = async (event) => {
    event.preventDefault();
    if (!passwords.currentPassword || !passwords.newPassword) return toast.error("Please fill in all password fields.");
    if (passwords.newPassword.length < 8) return toast.error("New password must be at least 8 characters.");
    if (passwords.newPassword !== passwords.confirmPassword) return toast.error("New passwords do not match.");
    try {
      setSavingPassword(true);
      await changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password changed successfully.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not change password.");
    } finally { setSavingPassword(false); }
  };

  return <section className="profile-page">
    <header className="profile-header"><div><p>Account settings</p><h1>My profile</h1><span>Update your display name and keep your account secure.</span></div></header>
    <div className="profile-layout">
      <aside className="profile-summary"><div className="profile-avatar">{initials}</div><h2>{user?.full_name || "Your name"}</h2><p>{user?.role || "Counsellor"}</p><div><span>Account email</span><strong>{user?.email || "—"}</strong></div><div><span>Account status</span><strong className="profile-active">Active</strong></div></aside>
      <div className="profile-content">
        <form className="profile-form" onSubmit={saveProfile}>
          <div className="profile-card-heading"><div className="profile-card-icon"><UserRound size={19}/></div><div><h2>Personal details</h2><p>Your email is managed by an administrator and cannot be changed here.</p></div></div>
          <div className="profile-fields"><label>Full name<input value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" maxLength="150" /></label><label>Email address<input value={user?.email || ""} readOnly aria-readonly="true" /></label></div>
          <button className="profile-submit" type="submit" disabled={savingProfile}>{savingProfile ? <LoaderCircle className="spin" size={17}/> : <Save size={17}/>} {savingProfile ? "Saving..." : "Save name"}</button>
        </form>

        <form className="profile-form security-form" onSubmit={savePassword}>
          <div className="profile-card-heading"><div className="profile-card-icon security"><ShieldCheck size={19}/></div><div><h2>Change password</h2><p>Use a new, unique password with at least 8 characters.</p></div></div>
          <div className="profile-password-fields"><label>Current password<input type="password" value={passwords.currentPassword} onChange={(event) => setPasswords({ ...passwords, currentPassword: event.target.value })} autoComplete="current-password" /></label><label>New password<input type="password" value={passwords.newPassword} onChange={(event) => setPasswords({ ...passwords, newPassword: event.target.value })} autoComplete="new-password" /></label><label>Confirm new password<input type="password" value={passwords.confirmPassword} onChange={(event) => setPasswords({ ...passwords, confirmPassword: event.target.value })} autoComplete="new-password" /></label></div>
          <button className="profile-submit" type="submit" disabled={savingPassword}>{savingPassword ? <LoaderCircle className="spin" size={17}/> : <KeyRound size={17}/>} {savingPassword ? "Updating..." : "Update password"}</button>
        </form>
      </div>
    </div>
  </section>;
};

export default Profile;
