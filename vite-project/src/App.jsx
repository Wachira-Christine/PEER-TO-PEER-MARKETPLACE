import React, { useState } from 'react';
import { Search, Filter, MessageCircle, User, LogOut, Home, Briefcase, DollarSign, Star, Clock, Tag, TrendingUp, Award, Zap, Heart, Bell } from 'lucide-react';

const App = () => {
    const [currentPage, setCurrentPage] = useState('login');
    const [isLogin, setIsLogin] = useState(true);
    const [user, setUser] = useState(null);

    // Currency for Kenya
    const currency = 'KSh';

    // Updated Color palette - greens, dark teal, tan/beige, gold
    const colors = {
        darkTeal: '#0d4d4d',
        teal: '#1a7f7f',
        lightGreen: '#4ade80',
        sage: '#84a98c',
        tan: '#d4a574',
        beige: '#f5e6d3',
        gold: '#fbbf24',
        darkGold: '#f59e0b'
    };

    // Mock data for services
    const services = [
        {
            id: 1,
            title: "Professional Tutoring - Mathematics",
            provider: "Sarah Johnson",
            category: "Tutoring",
            price: 1500,
            rating: 4.8,
            reviews: 24,
            description: "Expert help in Calculus, Algebra, and Statistics",
            availability: "Mon-Fri, 6pm-9pm"
        },
        {
            id: 2,
            title: "Graphic Design Services",
            provider: "Mike Chen",
            category: "Design",
            price: 2500,
            rating: 4.9,
            reviews: 31,
            description: "Logo design, posters, social media graphics",
            availability: "Flexible schedule"
        },
        {
            id: 3,
            title: "CS Notes - Data Structures",
            provider: "Alex Kumar",
            category: "Notes",
            price: 1000,
            rating: 4.7,
            reviews: 18,
            description: "Comprehensive notes with examples and diagrams",
            availability: "Instant delivery"
        },
        {
            id: 4,
            title: "Essay Editing & Proofreading",
            provider: "Emma Williams",
            category: "Writing",
            price: 1200,
            rating: 5.0,
            reviews: 42,
            description: "Professional editing for academic papers",
            availability: "24-48 hour turnaround"
        },
        {
            id: 5,
            title: "Programming Help - Python/Java",
            provider: "David Martinez",
            category: "Tutoring",
            price: 2000,
            rating: 4.6,
            reviews: 15,
            description: "Debug code, explain concepts, project help",
            availability: "Weekends available"
        },
        {
            id: 6,
            title: "Photography Services",
            provider: "Lisa Anderson",
            category: "Photography",
            price: 3000,
            rating: 4.9,
            reviews: 27,
            description: "Event photography, portraits, editing",
            availability: "By appointment"
        }
    ];

    const handleLogin = () => {
        setUser({ name: "Student User", credits: 15000 }); // Changed to KES (approx 150 USD = 15000 KES)
        setCurrentPage('dashboard');
    };

    const handleLogout = () => {
        setUser(null);
        setCurrentPage('login');
    };

    // Login/Registration Page
    const LoginPage = () => (
        <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${colors.beige} 0%, ${colors.tan}40 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div style={{ background: 'white', borderRadius: '2rem', boxShadow: '0 25px 50px -12px rgba(13, 77, 77, 0.25)', width: '100%', maxWidth: '28rem', overflow: 'hidden' }}>
                <div style={{ background: `linear-gradient(135deg, ${colors.darkTeal} 0%, ${colors.teal} 100%)`, padding: 'clamp(1.5rem, 4vw, 2.5rem)', color: 'white', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-2rem', right: '-2rem', width: '10rem', height: '10rem', background: colors.gold, borderRadius: '50%', opacity: 0.15 }}></div>
                    <div style={{ position: 'absolute', bottom: '-3rem', left: '-3rem', width: '12rem', height: '12rem', background: colors.lightGreen, borderRadius: '50%', opacity: 0.1 }}></div>
                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <div style={{ width: 'clamp(2.5rem, 6vw, 3rem)', height: 'clamp(2.5rem, 6vw, 3rem)', background: colors.gold, borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                                <Briefcase size={Math.min(window.innerWidth * 0.06, 24)} color={colors.darkTeal} />
                            </div>
                            <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 'bold', margin: 0 }}>StudentHub</h1>
                        </div>
                        <p style={{ color: colors.beige, fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)', margin: 0 }}>Your Campus Marketplace</p>
                    </div>
                </div>

                <div style={{ padding: 'clamp(1.5rem, 4vw, 2rem)' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: colors.beige, padding: '0.25rem', borderRadius: '1rem' }}>
                        <button
                            onClick={() => setIsLogin(true)}
                            style={{
                                flex: 1,
                                padding: 'clamp(0.625rem, 2vw, 0.75rem)',
                                borderRadius: '0.875rem',
                                fontWeight: '600',
                                fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                                transition: 'all 0.3s',
                                background: isLogin ? colors.teal : 'transparent',
                                color: isLogin ? 'white' : colors.darkTeal,
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: isLogin ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none'
                            }}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            style={{
                                flex: 1,
                                padding: 'clamp(0.625rem, 2vw, 0.75rem)',
                                borderRadius: '0.875rem',
                                fontWeight: '600',
                                fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                                transition: 'all 0.3s',
                                background: !isLogin ? colors.teal : 'transparent',
                                color: !isLogin ? 'white' : colors.darkTeal,
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: !isLogin ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none'
                            }}
                        >
                            Register
                        </button>
                    </div>

                    <div>
                        {!isLogin && (
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', color: colors.darkTeal, fontWeight: '600', marginBottom: '0.5rem', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}>Full Name</label>
                                <input
                                    type="text"
                                    style={{ width: '100%', padding: 'clamp(0.75rem, 2vw, 0.875rem) 1rem', border: `2px solid ${colors.beige}`, borderRadius: '1rem', outline: 'none', fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', transition: 'all 0.2s', boxSizing: 'border-box' }}
                                    placeholder="Enter your full name"
                                    onFocus={(e) => e.target.style.borderColor = colors.teal}
                                    onBlur={(e) => e.target.style.borderColor = colors.beige}
                                />
                            </div>
                        )}

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', color: colors.darkTeal, fontWeight: '600', marginBottom: '0.5rem', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}>
                                {isLogin ? 'Email or Student ID' : 'Student ID'}
                            </label>
                            <input
                                type="text"
                                style={{ width: '100%', padding: 'clamp(0.75rem, 2vw, 0.875rem) 1rem', border: `2px solid ${colors.beige}`, borderRadius: '1rem', outline: 'none', fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', transition: 'all 0.2s', boxSizing: 'border-box' }}
                                placeholder={isLogin ? 'Enter email or student ID' : 'Enter your student ID'}
                                onFocus={(e) => e.target.style.borderColor = colors.teal}
                                onBlur={(e) => e.target.style.borderColor = colors.beige}
                            />
                        </div>

                        {!isLogin && (
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', color: colors.darkTeal, fontWeight: '600', marginBottom: '0.5rem', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}>Email</label>
                                <input
                                    type="email"
                                    style={{ width: '100%', padding: 'clamp(0.75rem, 2vw, 0.875rem) 1rem', border: `2px solid ${colors.beige}`, borderRadius: '1rem', outline: 'none', fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', transition: 'all 0.2s', boxSizing: 'border-box' }}
                                    placeholder="Enter your email"
                                    onFocus={(e) => e.target.style.borderColor = colors.teal}
                                    onBlur={(e) => e.target.style.borderColor = colors.beige}
                                />
                            </div>
                        )}

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', color: colors.darkTeal, fontWeight: '600', marginBottom: '0.5rem', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}>Password</label>
                            <input
                                type="password"
                                style={{ width: '100%', padding: 'clamp(0.75rem, 2vw, 0.875rem) 1rem', border: `2px solid ${colors.beige}`, borderRadius: '1rem', outline: 'none', fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', transition: 'all 0.2s', boxSizing: 'border-box' }}
                                placeholder="Enter your password"
                                onFocus={(e) => e.target.style.borderColor = colors.teal}
                                onBlur={(e) => e.target.style.borderColor = colors.beige}
                            />
                        </div>

                        {!isLogin && (
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', color: colors.darkTeal, fontWeight: '600', marginBottom: '0.5rem', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}>Confirm Password</label>
                                <input
                                    type="password"
                                    style={{ width: '100%', padding: 'clamp(0.75rem, 2vw, 0.875rem) 1rem', border: `2px solid ${colors.beige}`, borderRadius: '1rem', outline: 'none', fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', transition: 'all 0.2s', boxSizing: 'border-box' }}
                                    placeholder="Confirm your password"
                                    onFocus={(e) => e.target.style.borderColor = colors.teal}
                                    onBlur={(e) => e.target.style.borderColor = colors.beige}
                                />
                            </div>
                        )}

                        {isLogin && (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                    <input type="checkbox" style={{ marginRight: '0.5rem', width: '1.1rem', height: '1.1rem', accentColor: colors.teal, cursor: 'pointer' }} />
                                    <span style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', color: '#6b7280' }}>Remember me</span>
                                </label>
                                <button style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', color: colors.teal, fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        <button
                            onClick={handleLogin}
                            style={{
                                width: '100%',
                                background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.darkGold} 100%)`,
                                color: colors.darkTeal,
                                padding: 'clamp(0.875rem, 2.5vw, 1rem)',
                                borderRadius: '1rem',
                                fontWeight: '700',
                                fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 6px 16px rgba(251, 191, 36, 0.4)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 12px rgba(251, 191, 36, 0.3)';
                            }}
                        >
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </button>
                    </div>

                    {!isLogin && (
                        <p style={{ marginTop: '1rem', fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)', color: '#9ca3af', textAlign: 'center', lineHeight: 1.4 }}>
                            By registering, you agree to our Terms of Service and Privacy Policy
                        </p>
                    )}
                </div>
            </div>
        </div>
    );

    // Dashboard Page
    const Dashboard = () => (
        <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${colors.beige} 0%, #ffffff 100%)` }}>
            <nav style={{ background: 'white', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)', borderBottom: `3px solid ${colors.gold}` }}>
                <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '2.75rem', height: '2.75rem', background: `linear-gradient(135deg, ${colors.teal}, ${colors.darkTeal})`, borderRadius: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 8px rgba(26, 127, 127, 0.3)' }}>
                                <Briefcase color={colors.gold} size={22} />
                            </div>
                            <div>
                                <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: colors.darkTeal, margin: 0, lineHeight: 1 }}>
                                    StudentHub
                                </h1>
                                <p style={{ fontSize: '0.65rem', color: colors.sage, margin: 0, lineHeight: 1 }}>Marketplace</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => setCurrentPage('dashboard')}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', color: colors.teal, fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', minWidth: '50px' }}
                            >
                                <Home size={20} />
                                <span style={{ fontSize: '0.7rem' }}>Home</span>
                            </button>
                            <button
                                onClick={() => setCurrentPage('services')}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', minWidth: '50px' }}
                            >
                                <Briefcase size={20} />
                                <span style={{ fontSize: '0.7rem' }}>Services</span>
                            </button>
                            <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', color: '#6b7280', position: 'relative', background: 'none', border: 'none', cursor: 'pointer', minWidth: '50px' }}>
                                <MessageCircle size={20} />
                                <span style={{ fontSize: '0.7rem' }}>Messages</span>
                                <span style={{ position: 'absolute', top: '-0.25rem', right: '0.25rem', background: colors.gold, color: colors.darkTeal, fontSize: '0.65rem', width: '1.1rem', height: '1.1rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>3</span>
                            </button>
                            <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', minWidth: '50px' }}>
                                <User size={20} />
                                <span style={{ fontSize: '0.7rem' }}>Profile</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', minWidth: '50px' }}
                            >
                                <LogOut size={20} />
                                <span style={{ fontSize: '0.7rem' }}>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1.5rem 1rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 'bold', color: colors.darkTeal, marginBottom: '0.5rem' }}>
                        Welcome back, {user?.name}! 🎉
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)' }}>Your marketplace dashboard is ready</p>
                </div>

                {/* Credit Balance Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                    <div style={{ background: `linear-gradient(135deg, ${colors.darkTeal} 0%, ${colors.teal} 100%)`, borderRadius: '1.25rem', padding: '1.5rem', color: 'white', boxShadow: '0 10px 25px rgba(13, 77, 77, 0.3)', position: 'relative', overflow: 'hidden', minHeight: '200px' }}>
                        <div style={{ position: 'absolute', top: '-3rem', right: '-3rem', width: '12rem', height: '12rem', background: colors.gold, borderRadius: '50%', opacity: 0.1 }}></div>
                        <div style={{ position: 'relative', zIndex: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <span style={{ color: colors.beige, fontWeight: '500', fontSize: '0.85rem' }}>💰 Credit Balance</span>
                                <div style={{ background: 'rgba(255,255,255,0.15)', padding: '0.5rem', borderRadius: '0.65rem', backdropFilter: 'blur(10px)' }}>
                                    <DollarSign size={20} />
                                </div>
                            </div>
                            <p style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 'bold', marginBottom: '1rem', color: colors.gold }}>{currency}{user?.credits?.toLocaleString()}</p>
                            <button style={{ background: colors.gold, color: colors.darkTeal, padding: '0.65rem 1.5rem', borderRadius: '0.75rem', fontWeight: '700', fontSize: '0.9rem', border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 8px rgba(0,0,0,0.15)', width: '100%' }}>
                                Top Up Now
                            </button>
                        </div>
                    </div>

                    <div style={{ background: `linear-gradient(135deg, ${colors.tan} 0%, ${colors.beige} 100%)`, borderRadius: '1.25rem', padding: '1.5rem', color: colors.darkTeal, boxShadow: '0 10px 25px rgba(212, 165, 116, 0.3)', position: 'relative', overflow: 'hidden', minHeight: '200px' }}>
                        <div style={{ position: 'absolute', top: '-3rem', right: '-3rem', width: '12rem', height: '12rem', background: colors.darkTeal, borderRadius: '50%', opacity: 0.05 }}></div>
                        <div style={{ position: 'relative', zIndex: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <span style={{ color: colors.darkTeal, fontWeight: '500', fontSize: '0.85rem', opacity: 0.8 }}>📦 Active Services</span>
                                <div style={{ background: 'rgba(13, 77, 77, 0.1)', padding: '0.5rem', borderRadius: '0.65rem' }}>
                                    <Briefcase size={20} color={colors.darkTeal} />
                                </div>
                            </div>
                            <p style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 'bold', marginBottom: '1rem' }}>3</p>
                            <button style={{ background: colors.darkTeal, color: 'white', padding: '0.65rem 1.5rem', borderRadius: '0.75rem', fontWeight: '700', fontSize: '0.9rem', border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 8px rgba(0,0,0,0.15)', width: '100%' }}>
                                Manage All
                            </button>
                        </div>
                    </div>

                    <div style={{ background: `linear-gradient(135deg, ${colors.lightGreen} 0%, ${colors.sage} 100%)`, borderRadius: '1.25rem', padding: '1.5rem', color: 'white', boxShadow: '0 10px 25px rgba(74, 222, 128, 0.3)', position: 'relative', overflow: 'hidden', minHeight: '200px' }}>
                        <div style={{ position: 'absolute', top: '-3rem', right: '-3rem', width: '12rem', height: '12rem', background: 'white', borderRadius: '50%', opacity: 0.15 }}></div>
                        <div style={{ position: 'relative', zIndex: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <span style={{ color: 'white', fontWeight: '500', fontSize: '0.85rem', opacity: 0.95 }}>📬 New Requests</span>
                                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '0.65rem' }}>
                                    <Bell size={20} />
                                </div>
                            </div>
                            <p style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 'bold', marginBottom: '1rem' }}>5</p>
                            <button style={{ background: 'white', color: colors.sage, padding: '0.65rem 1.5rem', borderRadius: '0.75rem', fontWeight: '700', fontSize: '0.9rem', border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 8px rgba(0,0,0,0.15)', width: '100%' }}>
                                View All
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div style={{ background: 'white', borderRadius: '1.25rem', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', padding: '1.5rem', marginBottom: '2rem', border: `2px solid ${colors.beige}` }}>
                    <h3 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 'bold', color: colors.darkTeal, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <Zap size={24} color={colors.gold} />
                        Quick Actions
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem', background: `linear-gradient(135deg, ${colors.teal}15, ${colors.teal}05)`, borderRadius: '1rem', border: `2px solid ${colors.teal}30`, cursor: 'pointer', transition: 'all 0.3s', justifyContent: 'center' }}>
                            <div style={{ background: colors.teal, padding: '0.75rem', borderRadius: '1rem', boxShadow: '0 4px 8px rgba(26, 127, 127, 0.25)' }}>
                                <Briefcase size={20} color="white" />
                            </div>
                            <span style={{ fontWeight: '700', color: colors.darkTeal, fontSize: '0.95rem' }}>Post Service</span>
                        </button>
                        <button
                            onClick={() => setCurrentPage('services')}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem', background: `linear-gradient(135deg, ${colors.gold}15, ${colors.gold}05)`, borderRadius: '1rem', border: `2px solid ${colors.gold}30`, cursor: 'pointer', transition: 'all 0.3s', justifyContent: 'center' }}
                        >
                            <div style={{ background: colors.gold, padding: '0.75rem', borderRadius: '1rem', boxShadow: '0 4px 8px rgba(251, 191, 36, 0.25)' }}>
                                <Search size={20} color={colors.darkTeal} />
                            </div>
                            <span style={{ fontWeight: '700', color: colors.darkTeal, fontSize: '0.95rem' }}>Browse</span>
                        </button>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem', background: `linear-gradient(135deg, ${colors.tan}15, ${colors.tan}05)`, borderRadius: '1rem', border: `2px solid ${colors.tan}30`, cursor: 'pointer', transition: 'all 0.3s', justifyContent: 'center' }}>
                            <div style={{ background: colors.tan, padding: '0.75rem', borderRadius: '1rem', boxShadow: '0 4px 8px rgba(212, 165, 116, 0.25)' }}>
                                <MessageCircle size={20} color="white" />
                            </div>
                            <span style={{ fontWeight: '700', color: colors.darkTeal, fontSize: '0.95rem' }}>Messages</span>
                        </button>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem', background: `linear-gradient(135deg, ${colors.lightGreen}15, ${colors.lightGreen}05)`, borderRadius: '1rem', border: `2px solid ${colors.lightGreen}30`, cursor: 'pointer', transition: 'all 0.3s', justifyContent: 'center' }}>
                            <div style={{ background: colors.lightGreen, padding: '0.75rem', borderRadius: '1rem', boxShadow: '0 4px 8px rgba(74, 222, 128, 0.25)' }}>
                                <TrendingUp size={20} color="white" />
                            </div>
                            <span style={{ fontWeight: '700', color: colors.darkTeal, fontSize: '0.95rem' }}>Analytics</span>
                        </button>
                    </div>
                </div>

                {/* Recent Activity */}
                <div style={{ background: 'white', borderRadius: '1.25rem', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', padding: '1.5rem', border: `2px solid ${colors.beige}` }}>
                    <h3 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 'bold', color: colors.darkTeal, marginBottom: '1.25rem' }}>Recent Activity</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: `linear-gradient(to right, ${colors.lightGreen}20, transparent)`, borderRadius: '1rem', borderLeft: `5px solid ${colors.lightGreen}`, flexWrap: 'wrap' }}>
                            <div style={{ background: colors.lightGreen, padding: '0.75rem', borderRadius: '1rem', boxShadow: '0 4px 8px rgba(74, 222, 128, 0.25)' }}>
                                <DollarSign size={20} color="white" />
                            </div>
                            <div style={{ flex: '1 1 200px' }}>
                                <p style={{ fontWeight: '700', color: colors.darkTeal, fontSize: '1rem', marginBottom: '0.25rem' }}>Payment Received</p>
                                <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>From Alex Kumar for CS Notes</p>
                            </div>
                            <span style={{ color: colors.lightGreen, fontWeight: 'bold', fontSize: '1.2rem' }}>+{currency}1,000</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: `linear-gradient(to right, ${colors.gold}20, transparent)`, borderRadius: '1rem', borderLeft: `5px solid ${colors.gold}`, flexWrap: 'wrap' }}>
                            <div style={{ background: colors.gold, padding: '0.75rem', borderRadius: '1rem', boxShadow: '0 4px 8px rgba(251, 191, 36, 0.25)' }}>
                                <Star size={20} color="white" />
                            </div>
                            <div style={{ flex: '1 1 200px' }}>
                                <p style={{ fontWeight: '700', color: colors.darkTeal, fontSize: '1rem', marginBottom: '0.25rem' }}>New Review</p>
                                <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>⭐⭐⭐⭐⭐ 5 stars on your tutoring service</p>
                            </div>
                            <span style={{ color: '#6b7280', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>2h ago</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: `linear-gradient(to right, ${colors.tan}20, transparent)`, borderRadius: '1rem', borderLeft: `5px solid ${colors.tan}`, flexWrap: 'wrap' }}>
                            <div style={{ background: colors.tan, padding: '0.75rem', borderRadius: '1rem', boxShadow: '0 4px 8px rgba(212, 165, 116, 0.25)' }}>
                                <MessageCircle size={20} color="white" />
                            </div>
                            <div style={{ flex: '1 1 200px' }}>
                                <p style={{ fontWeight: '700', color: colors.darkTeal, fontSize: '1rem', marginBottom: '0.25rem' }}>New Message</p>
                                <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Sarah Johnson sent you a message</p>
                            </div>
                            <span style={{ color: '#6b7280', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>5h ago</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: `linear-gradient(to right, ${colors.teal}20, transparent)`, borderRadius: '1rem', borderLeft: `5px solid ${colors.teal}`, flexWrap: 'wrap' }}>
                            <div style={{ background: colors.teal, padding: '0.75rem', borderRadius: '1rem', boxShadow: '0 4px 8px rgba(26, 127, 127, 0.25)' }}>
                                <Award size={20} color="white" />
                            </div>
                            <div style={{ flex: '1 1 200px' }}>
                                <p style={{ fontWeight: '700', color: colors.darkTeal, fontSize: '1rem', marginBottom: '0.25rem' }}>Achievement Unlocked!</p>
                                <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>You've completed 10 successful transactions 🎉</p>
                            </div>
                            <span style={{ color: '#6b7280', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>1d ago</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Service Listings Page
    const ServicesPage = () => (
        <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${colors.beige} 0%, #ffffff 100%)` }}>
            <nav style={{ background: 'white', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)', borderBottom: `3px solid ${colors.gold}` }}>
                <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '2.75rem', height: '2.75rem', background: `linear-gradient(135deg, ${colors.teal}, ${colors.darkTeal})`, borderRadius: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 8px rgba(26, 127, 127, 0.3)' }}>
                                <Briefcase color={colors.gold} size={22} />
                            </div>
                            <div>
                                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.darkTeal, margin: 0, lineHeight: 1 }}>
                                    StudentHub
                                </h1>
                                <p style={{ fontSize: '0.7rem', color: colors.sage, margin: 0, lineHeight: 1 }}>Marketplace</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <button
                                onClick={() => setCurrentPage('dashboard')}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                <Home size={22} />
                                <span style={{ fontSize: '0.75rem' }}>Home</span>
                            </button>
                            <button
                                onClick={() => setCurrentPage('services')}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', color: colors.teal, fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                <Briefcase size={22} />
                                <span style={{ fontSize: '0.75rem' }}>Services</span>
                            </button>
                            <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', color: '#6b7280', position: 'relative', background: 'none', border: 'none', cursor: 'pointer' }}>
                                <MessageCircle size={22} />
                                <span style={{ fontSize: '0.75rem' }}>Messages</span>
                                <span style={{ position: 'absolute', top: '-0.25rem', right: '-0.5rem', background: colors.gold, color: colors.darkTeal, fontSize: '0.7rem', width: '1.25rem', height: '1.25rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>3</span>
                            </button>
                            <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}>
                                <User size={22} />
                                <span style={{ fontSize: '0.75rem' }}>Profile</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                <LogOut size={22} />
                                <span style={{ fontSize: '0.75rem' }}>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1.5rem 1rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 'bold', color: colors.darkTeal, marginBottom: '0.5rem' }}>Browse Services 🎯</h2>
                    <p style={{ color: '#6b7280', fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)' }}>Discover amazing talent from your fellow students</p>
                </div>

                {/* Search and Filters */}
                <div style={{ background: 'white', borderRadius: '1.25rem', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', padding: '1.5rem', marginBottom: '2rem', border: `2px solid ${colors.beige}` }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'stretch' }}>
                        <div style={{ flex: '1 1 250px', position: 'relative' }}>
                            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: colors.sage }} size={20} />
                            <input
                                type="text"
                                placeholder="Search for services..."
                                style={{ width: '100%', paddingLeft: '3rem', paddingRight: '1rem', paddingTop: '0.875rem', paddingBottom: '0.875rem', border: `2px solid ${colors.beige}`, borderRadius: '1rem', outline: 'none', fontSize: '0.95rem', transition: 'all 0.2s' }}
                                onFocus={(e) => e.target.style.borderColor = colors.teal}
                                onBlur={(e) => e.target.style.borderColor = colors.beige}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', flex: '0 0 auto' }}>
                            <select style={{ padding: '0.875rem 1rem', border: `2px solid ${colors.beige}`, borderRadius: '1rem', outline: 'none', background: 'white', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500', color: colors.darkTeal }}>
                                <option>All Categories</option>
                                <option>Tutoring</option>
                                <option>Design</option>
                                <option>Notes</option>
                                <option>Writing</option>
                                <option>Photography</option>
                            </select>
                            <select style={{ padding: '0.875rem 1rem', border: `2px solid ${colors.beige}`, borderRadius: '1rem', outline: 'none', background: 'white', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500', color: colors.darkTeal }}>
                                <option>Price: Any</option>
                                <option>Under KSh 1,500</option>
                                <option>KSh 1,500 - 2,500</option>
                                <option>Over KSh 2,500</option>
                            </select>
                            <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.25rem', background: colors.gold, color: colors.darkTeal, borderRadius: '1rem', fontWeight: '700', border: 'none', cursor: 'pointer', boxShadow: '0 4px 8px rgba(251, 191, 36, 0.25)', fontSize: '0.9rem' }}>
                                <Filter size={18} />
                                <span>Filter</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Service Cards Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '1.5rem' }}>
                    {services.map((service, index) => {
                        const cardColors = [
                            { gradient: `linear-gradient(135deg, ${colors.teal} 0%, ${colors.darkTeal} 100%)`, buttonBg: colors.teal, accentBg: colors.lightGreen },
                            { gradient: `linear-gradient(135deg, ${colors.sage} 0%, ${colors.teal} 100%)`, buttonBg: colors.sage, accentBg: colors.gold },
                            { gradient: `linear-gradient(135deg, ${colors.tan} 0%, #c99a6e 100%)`, buttonBg: colors.tan, accentBg: colors.darkTeal },
                            { gradient: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.darkGold} 100%)`, buttonBg: colors.gold, accentBg: colors.teal },
                            { gradient: `linear-gradient(135deg, ${colors.lightGreen} 0%, ${colors.sage} 100%)`, buttonBg: colors.lightGreen, accentBg: colors.tan },
                            { gradient: `linear-gradient(135deg, ${colors.darkTeal} 0%, ${colors.teal} 100%)`, buttonBg: colors.darkTeal, accentBg: colors.gold },
                        ];
                        const cardColor = cardColors[index % cardColors.length];

                        return (
                            <div key={service.id} style={{ background: 'white', borderRadius: '1.5rem', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)', overflow: 'hidden', border: `2px solid ${colors.beige}`, transition: 'all 0.3s', cursor: 'pointer' }}>
                                <div style={{ background: cardColor.gradient, height: '10rem', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', top: '-3rem', right: '-3rem', width: '10rem', height: '10rem', background: 'rgba(255,255,255,0.15)', borderRadius: '50%' }}></div>
                                    <div style={{ position: 'absolute', bottom: '-2rem', left: '-2rem', width: '8rem', height: '8rem', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
                                    <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'white', padding: '0.5rem 1.25rem', borderRadius: '9999px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)' }}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: colors.darkTeal }}>{service.category}</span>
                                    </div>
                                    {service.rating >= 4.8 && (
                                        <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', background: cardColor.accentBg, padding: '0.6rem', borderRadius: '0.75rem', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
                                            <Zap size={22} color="white" fill="white" />
                                        </div>
                                    )}
                                </div>

                                <div style={{ padding: '1.75rem' }}>
                                    <h3 style={{ fontSize: '1.35rem', fontWeight: 'bold', color: colors.darkTeal, marginBottom: '0.75rem', lineHeight: 1.3 }}>{service.title}</h3>
                                    <p style={{ color: '#6b7280', fontSize: '0.95rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>{service.description}</p>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={18}
                                                    color={i < Math.floor(service.rating) ? colors.gold : '#d1d5db'}
                                                    fill={i < Math.floor(service.rating) ? colors.gold : 'none'}
                                                />
                                            ))}
                                        </div>
                                        <span style={{ fontWeight: '700', color: colors.darkTeal, fontSize: '1.05rem' }}>{service.rating}</span>
                                        <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>({service.reviews})</span>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', color: '#6b7280', fontSize: '0.95rem' }}>
                                        <User size={18} color={colors.sage} />
                                        <span style={{ fontWeight: '600', color: colors.darkTeal }}>{service.provider}</span>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', color: '#6b7280', fontSize: '0.9rem' }}>
                                        <Clock size={18} color={colors.tan} />
                                        <span>{service.availability}</span>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.25rem', borderTop: `2px solid ${colors.beige}`, flexWrap: 'wrap', gap: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Tag color={colors.sage} size={22} />
                                            <span style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 'bold', color: colors.darkTeal }}>{currency}{service.price.toLocaleString()}</span>
                                        </div>
                                        <button style={{ background: cardColor.buttonBg, color: cardColor.buttonBg === colors.gold ? colors.darkTeal : 'white', padding: '0.75rem 1.5rem', borderRadius: '1rem', fontWeight: '700', border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 8px rgba(0,0,0,0.15)', minWidth: '120px' }}>
                                            Contact
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Load More */}
                <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                    <button style={{ background: 'white', border: `3px solid ${colors.teal}`, color: colors.teal, padding: '1rem 3rem', borderRadius: '1rem', fontWeight: '700', fontSize: '1.05rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(26, 127, 127, 0.2)', transition: 'all 0.3s' }}>
                        Load More Services
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            {currentPage === 'login' && <LoginPage />}
            {currentPage === 'dashboard' && user && <Dashboard />}
            {currentPage === 'services' && user && <ServicesPage />}
        </div>
    );
};

export default App;