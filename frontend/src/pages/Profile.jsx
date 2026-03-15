import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';
import axios from 'axios';
import { Camera, Save, Lock, User, Mail, Phone, FileText, Shield, CheckCircle, AlertCircle } from 'lucide-react';

const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);

    const [profile, setProfile] = useState({ name: '', bio: '', phone: '', avatar: '' });
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
    const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
    const [saving, setSaving] = useState(false);
    const [changingPw, setChangingPw] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [stats, setStats] = useState({ projects: 0, tasks: 0 });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axios.get('http://localhost:5001/api/users/profile');
                setProfile({ name: data.name, bio: data.bio || '', phone: data.phone || '', avatar: data.avatar || '' });
            } catch (err) {
                console.error(err);
            }
        };
        const fetchStats = async () => {
            try {
                const { data } = await axios.get('http://localhost:5001/api/projects');
                setStats({ projects: data.length, tasks: 0 });
            } catch (err) {
                console.error(err);
            }
        };
        fetchProfile();
        fetchStats();
    }, []);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        setProfileMsg({ type: '', text: '' });
        try {
            const formData = new FormData();
            formData.append('name', profile.name);
            formData.append('bio', profile.bio);
            formData.append('phone', profile.phone);
            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }
            const { data } = await axios.put('http://localhost:5001/api/users/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            dispatch(loginSuccess({ ...user, name: data.name, avatar: data.avatar }));
            setProfile({ name: data.name, bio: data.bio || '', phone: data.phone || '', avatar: data.avatar || '' });
            setAvatarFile(null);
            setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordMsg({ type: '', text: '' });
        if (passwords.newPassword !== passwords.confirmPassword) {
            setPasswordMsg({ type: 'error', text: 'New passwords do not match' });
            return;
        }
        if (passwords.newPassword.length < 6) {
            setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }
        setChangingPw(true);
        try {
            await axios.put('http://localhost:5001/api/users/password', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword,
            });
            setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setPasswordMsg({ type: 'error', text: err.response?.data?.message || 'Failed to change password' });
        } finally {
            setChangingPw(false);
        }
    };

    const avatarSrc = avatarPreview || (profile.avatar ? `http://localhost:5001${profile.avatar}` : null);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Profile Settings</h1>
                <p className="mt-2 text-sm text-slate-500 font-medium">Manage your personal information and security.</p>
            </header>

            {/* Avatar & Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-[#00244D] to-[#003366] h-28 relative">
                    <div className="absolute -bottom-12 left-8">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg bg-slate-200 overflow-hidden flex items-center justify-center">
                                {avatarSrc ? (
                                    <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-3xl font-bold text-[#00244D]">
                                        {user?.name?.charAt(0)?.toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 w-8 h-8 bg-[#E81700] text-white rounded-lg flex items-center justify-center shadow-md hover:bg-[#C71400] transition-colors"
                            >
                                <Camera size={14} />
                            </button>
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                        </div>
                    </div>
                </div>
                <div className="pt-16 pb-6 px-8">
                    <div className="flex flex-wrap items-center gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
                            <p className="text-sm text-slate-500">{user?.email}</p>
                        </div>
                        <span className="ml-auto text-xs font-semibold bg-[#00244D]/10 text-[#00244D] px-3 py-1 rounded-full flex items-center gap-1.5">
                            <Shield size={12} /> {user?.role}
                        </span>
                    </div>
                    {/* Quick Stats */}
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div className="bg-slate-50 rounded-xl p-4 text-center">
                            <p className="text-2xl font-bold text-[#00244D]">{stats.projects}</p>
                            <p className="text-xs text-slate-500 font-medium mt-1">Projects</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 text-center">
                            <p className="text-2xl font-bold text-[#3498DB]">{user?.role}</p>
                            <p className="text-xs text-slate-500 font-medium mt-1">Role</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 text-center">
                            <p className="text-2xl font-bold text-[#2E7D32]">Active</p>
                            <p className="text-xs text-slate-500 font-medium mt-1">Status</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <User size={20} className="text-[#3498DB]" /> Personal Information
                </h3>
                {profileMsg.text && (
                    <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${profileMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {profileMsg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        <p className="text-sm font-medium">{profileMsg.text}</p>
                    </div>
                )}
                <form onSubmit={handleSaveProfile} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-[#00244D] mb-1.5">Full Name</label>
                            <div className="relative">
                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00244D]/20 focus:border-[#00244D] text-sm" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#00244D] mb-1.5">Email</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="email" value={user?.email} disabled
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 text-sm cursor-not-allowed" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-[#00244D] mb-1.5">Phone</label>
                        <div className="relative">
                            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="tel" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})}
                                placeholder="+962 xxxxxxxx"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00244D]/20 focus:border-[#00244D] text-sm" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-[#00244D] mb-1.5">Bio</label>
                        <div className="relative">
                            <FileText size={16} className="absolute left-3 top-3 text-gray-400" />
                            <textarea value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})}
                                placeholder="Tell us a little about yourself..."
                                rows="3"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00244D]/20 focus:border-[#00244D] text-sm resize-none" />
                        </div>
                    </div>
                    <button type="submit" disabled={saving}
                        className="flex items-center gap-2 bg-[#E81700] hover:bg-[#C71400] text-white font-semibold py-2.5 px-6 rounded-xl shadow-lg shadow-red-500/20 transition-all text-sm disabled:opacity-50">
                        <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>

            {/* Password Change */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Lock size={20} className="text-[#E81700]" /> Change Password
                </h3>
                {passwordMsg.text && (
                    <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${passwordMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {passwordMsg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        <p className="text-sm font-medium">{passwordMsg.text}</p>
                    </div>
                )}
                <form onSubmit={handleChangePassword} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-[#00244D] mb-1.5">Current Password</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                                required placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00244D]/20 focus:border-[#00244D] text-sm" />
                        </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-[#00244D] mb-1.5">New Password</label>
                            <input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                                required minLength="6" placeholder="••••••••"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00244D]/20 focus:border-[#00244D] text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#00244D] mb-1.5">Confirm New Password</label>
                            <input type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                                required minLength="6" placeholder="••••••••"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00244D]/20 focus:border-[#00244D] text-sm" />
                        </div>
                    </div>
                    <button type="submit" disabled={changingPw}
                        className="flex items-center gap-2 bg-[#00244D] hover:bg-[#003366] text-white font-semibold py-2.5 px-6 rounded-xl shadow-lg shadow-[#00244D]/20 transition-all text-sm disabled:opacity-50">
                        <Lock size={16} /> {changingPw ? 'Changing...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
