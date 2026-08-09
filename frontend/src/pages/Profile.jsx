import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';
import axios from 'axios';
import { Camera, Save, Lock, User, Mail, Phone, FileText, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

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
    const [stats, setStats] = useState({ projects: 0 });

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
                setStats({ projects: data.length });
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
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-12">
            <header>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E3A2F] tracking-tight">Account & Security</h1>
                <p className="mt-1 text-xs sm:text-sm text-[#596F65]">Manage your profile credentials and security settings.</p>
            </header>

            {/* Avatar & Profile Banner */}
            <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-[#E5ECE8] overflow-hidden">
                <div className="bg-[#1E3A2F] h-28 sm:h-32 relative">
                    <div className="absolute -bottom-10 sm:-bottom-12 left-5 sm:left-8">
                        <div className="relative group">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-white shadow-xl bg-[#FAF9F5] overflow-hidden flex items-center justify-center">
                                {avatarSrc ? (
                                    <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-2xl sm:text-3xl font-extrabold text-[#1E3A2F]">
                                        {user?.name?.charAt(0)?.toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 bg-[#1E3A2F] hover:bg-[#142820] text-white rounded-xl flex items-center justify-center shadow-lg transition-colors border-2 border-white"
                                title="Change avatar"
                            >
                                <Camera size={13} className="sm:w-3.5 sm:h-3.5" />
                            </button>
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                        </div>
                    </div>
                </div>

                <div className="pt-14 sm:pt-16 pb-6 px-5 sm:px-8">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-[#1E3A2F]">{user?.name}</h2>
                            <p className="text-xs text-[#6B7F76]">{user?.email}</p>
                        </div>
                        <span className="text-[10px] sm:text-xs font-bold bg-[#EBF3EE] text-[#1E3A2F] border border-[#D1E7DD] px-3 py-1 rounded-full flex items-center gap-1.5">
                            <Shield size={12} /> {user?.role} Access
                        </span>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-5 sm:mt-6 grid grid-cols-3 gap-2.5 sm:gap-4">
                        <div className="bg-[#FAF9F5] rounded-2xl p-3 sm:p-4 text-center border border-[#E5ECE8]">
                            <p className="text-lg sm:text-2xl font-extrabold text-[#1E3A2F]">{stats.projects}</p>
                            <p className="text-[9px] sm:text-[11px] text-[#6B7F76] font-semibold uppercase tracking-wider mt-0.5">Projects</p>
                        </div>
                        <div className="bg-[#FAF9F5] rounded-2xl p-3 sm:p-4 text-center border border-[#E5ECE8]">
                            <p className="text-lg sm:text-2xl font-extrabold text-[#3E735E] truncate">{user?.role}</p>
                            <p className="text-[9px] sm:text-[11px] text-[#6B7F76] font-semibold uppercase tracking-wider mt-0.5">Role</p>
                        </div>
                        <div className="bg-[#FAF9F5] rounded-2xl p-3 sm:p-4 text-center border border-[#E5ECE8]">
                            <p className="text-lg sm:text-2xl font-extrabold text-emerald-800">Active</p>
                            <p className="text-[9px] sm:text-[11px] text-[#6B7F76] font-semibold uppercase tracking-wider mt-0.5">Status</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Form */}
            <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-[#E5ECE8] p-5 sm:p-8 space-y-5 sm:space-y-6">
                <h3 className="text-sm sm:text-base font-bold text-[#1E3A2F] flex items-center gap-2">
                    <User size={16} className="text-[#3E735E]" />
                    Personal Information
                </h3>

                {profileMsg.text && (
                    <div className={`p-3.5 sm:p-4 rounded-2xl flex items-start gap-2.5 border ${profileMsg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                        {profileMsg.type === 'success' ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" /> : <AlertCircle size={16} className="shrink-0 mt-0.5" />}
                        <p className="text-xs font-semibold">{profileMsg.text}</p>
                    </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#1E3A2F] mb-1.5">Full Name</label>
                            <div className="relative">
                                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={profile.name}
                                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAF9F5] border border-[#D5DDD8] rounded-xl text-xs text-[#1A2421] focus:outline-none focus:border-[#1E3A2F]"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#1E3A2F] mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    value={user?.email}
                                    disabled
                                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#F4F2EC] border border-[#E5ECE8] rounded-xl text-xs text-[#6B7F76] cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#1E3A2F] mb-1.5">Contact Phone</label>
                        <div className="relative">
                            <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="tel"
                                value={profile.phone}
                                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                                placeholder="+1 (555) 000-0000"
                                className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAF9F5] border border-[#D5DDD8] rounded-xl text-xs text-[#1A2421] focus:outline-none focus:border-[#1E3A2F]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#1E3A2F] mb-1.5">Academic Bio / Interests</label>
                        <div className="relative">
                            <FileText size={15} className="absolute left-3.5 top-3 text-slate-400" />
                            <textarea
                                value={profile.bio}
                                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                                placeholder="Share your academic interests or research focus..."
                                rows="3"
                                className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAF9F5] border border-[#D5DDD8] rounded-xl text-xs text-[#1A2421] focus:outline-none focus:border-[#1E3A2F] resize-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1E3A2F] hover:bg-[#142820] text-white font-bold py-2.5 px-6 rounded-full shadow-md transition-all text-xs disabled:opacity-50"
                    >
                        <Save size={14} />
                        <span>{saving ? 'Saving...' : 'Save Profile'}</span>
                    </button>
                </form>
            </div>

            {/* Password Change */}
            <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-[#E5ECE8] p-5 sm:p-8 space-y-5 sm:space-y-6">
                <h3 className="text-sm sm:text-base font-bold text-[#1E3A2F] flex items-center gap-2">
                    <Lock size={16} className="text-[#3E735E]" />
                    Change Account Password
                </h3>

                {passwordMsg.text && (
                    <div className={`p-3.5 sm:p-4 rounded-2xl flex items-start gap-2.5 border ${passwordMsg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                        {passwordMsg.type === 'success' ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" /> : <AlertCircle size={16} className="shrink-0 mt-0.5" />}
                        <p className="text-xs font-semibold">{passwordMsg.text}</p>
                    </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#1E3A2F] mb-1.5">Current Password</label>
                        <div className="relative">
                            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="password"
                                value={passwords.currentPassword}
                                onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                                required
                                placeholder="••••••••"
                                className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAF9F5] border border-[#D5DDD8] rounded-xl text-xs text-[#1A2421] focus:outline-none focus:border-[#1E3A2F]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#1E3A2F] mb-1.5">New Password</label>
                            <input
                                type="password"
                                value={passwords.newPassword}
                                onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                                required
                                minLength="6"
                                placeholder="••••••••"
                                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#D5DDD8] rounded-xl text-xs text-[#1A2421] focus:outline-none focus:border-[#1E3A2F]"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#1E3A2F] mb-1.5">Confirm New Password</label>
                            <input
                                type="password"
                                value={passwords.confirmPassword}
                                onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                                required
                                minLength="6"
                                placeholder="••••••••"
                                className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#D5DDD8] rounded-xl text-xs text-[#1A2421] focus:outline-none focus:border-[#1E3A2F]"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={changingPw}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FAF9F5] hover:bg-[#F4F2EC] border border-[#D5DDD8] text-[#1E3A2F] font-bold py-2.5 px-6 rounded-full transition-all text-xs disabled:opacity-50"
                    >
                        <Lock size={14} />
                        <span>{changingPw ? 'Updating...' : 'Update Password'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
