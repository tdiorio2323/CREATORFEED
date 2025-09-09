import React, { useState } from 'react';
// FIX: Imported IconProps to correctly type icon components.
import type { Post, User, Stat, IconProps } from '../types';
import {
    BarChartIcon, BellIcon, DollarSignIcon, FileTextIcon, HeartIcon, HomeIcon,
    ImageIcon, LayoutDashboardIcon, LifeBuoyIcon, LogOutIcon, MessageCircleIcon,
    SendIcon, SettingsIcon, SparklesIcon, UsersIcon, XIcon
} from './Icons';
import { generateGeminiContent } from '../services/geminiService';

// --- HELPER COMPONENTS FOR DASHBOARD ---

interface CreatePostProps {
    user: User;
    onPost: (newPost: Post) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ user, onPost }) => {
    const [text, setText] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const handleGenerateCaption = async () => {
        if (!text && !image) {
            alert("Please add some text or an image to generate a caption.");
            return;
        }
        setIsGenerating(true);
        const prompt = `You are an expert social media manager for elite creators on a premium platform called CABANA. Generate 3 engaging, short caption ideas for a post. The tone should be exclusive and high-value. Base it on the following text: "${text}". The post may also include an image. Format the output as a numbered list.`;
        
        const result = await generateGeminiContent(prompt);
        
        if (result && !result.startsWith("Error:")) {
            const formattedSuggestions = result.split('\n').filter(s => s.match(/^\d\./)).map(s => s.substring(s.indexOf('.') + 1).trim());
            setSuggestions(formattedSuggestions);
            setShowSuggestions(true);
        } else {
            alert(result);
        }
        setIsGenerating(false);
    };

    const handleSelectSuggestion = (suggestion: string) => {
        setText(suggestion);
        setShowSuggestions(false);
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!text && !image) return;
        
        const newPost: Post = {
            id: Date.now(),
            user: { name: user.name, handle: user.handle, avatarUrl: user.avatarUrl },
            time: 'Just now',
            text: text,
            imageUrl: image ? URL.createObjectURL(image) : null,
            likes: 0,
            comments: 0,
        };
        onPost(newPost);
        setText('');
        setImage(null);
        const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = "";
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="bg-black/50 border border-white/10 rounded-xl p-4">
                <div className="flex items-start space-x-4">
                    <img src={user.avatarUrl} alt="avatar" className="w-12 h-12 rounded-full border-2 border-purple-500" />
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="What's on your mind, creator?"
                        className="w-full h-24 bg-transparent text-white placeholder-gray-500 focus:outline-none resize-none"
                    />
                </div>
                {image && (
                     <div className="mt-4 pl-16 relative">
                        <img src={URL.createObjectURL(image)} alt="Preview" className="max-h-40 rounded-lg" />
                        <button type="button" onClick={() => setImage(null)} className="absolute top-2 right-2 bg-black/50 rounded-full p-1 text-white hover:bg-black">
                            <XIcon className="w-4 h-4" />
                        </button>
                    </div>
                )}
                <div className="flex justify-between items-center mt-4 pl-16">
                    <div className="flex items-center space-x-4">
                        <label htmlFor="fileInput" className="cursor-pointer text-gray-400 hover:text-purple-400 transition-colors">
                            <ImageIcon className="h-6 w-6" />
                            <input id="fileInput" name="fileInput" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                        </label>
                         <button
                            type="button"
                            onClick={handleGenerateCaption}
                            disabled={isGenerating}
                            className="group flex items-center text-sm text-gray-400 hover:text-purple-400 transition-colors disabled:opacity-50 disabled:cursor-wait"
                        >
                            <SparklesIcon className="h-5 w-5 mr-1" />
                            {isGenerating ? 'Generating...' : 'Generate Caption ✨'}
                        </button>
                    </div>
                    <button type="submit" disabled={!text && !image} className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 flex items-center">
                        Post <SendIcon className="h-4 w-4 ml-2" />
                    </button>
                </div>
            </form>
            {showSuggestions && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-gray-900 border border-purple-500/50 rounded-2xl p-6 w-full max-w-lg shadow-2xl shadow-purple-500/20">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white flex items-center"><SparklesIcon className="h-6 w-6 mr-2 text-purple-400"/> AI Caption Suggestions</h3>
                            <button onClick={() => setShowSuggestions(false)} className="text-gray-500 hover:text-white"><XIcon className="h-6 w-6"/></button>
                        </div>
                        <div className="space-y-3">
                            {suggestions.map((s, i) => (
                                <div key={i} onClick={() => handleSelectSuggestion(s)} className="p-4 bg-black/50 border border-white/10 rounded-lg cursor-pointer hover:bg-purple-900/50 hover:border-purple-500 transition-all">
                                    <p className="text-gray-300">{s}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const FeedPost: React.FC<{ post: Post }> = ({ post }) => (
    <div className="bg-black/50 border border-white/10 rounded-xl p-4">
        <div className="flex items-start space-x-4">
            <img src={post.user.avatarUrl} alt="avatar" className="w-12 h-12 rounded-full" />
            <div className="flex-1">
                <div className="flex items-baseline space-x-2">
                    <p className="font-bold text-white">{post.user.name}</p>
                    <p className="text-sm text-gray-500">{post.user.handle}</p>
                    <p className="text-xs text-gray-600">· {post.time}</p>
                </div>
                <p className="text-white mt-1 whitespace-pre-wrap">{post.text}</p>
                {post.imageUrl && <img src={post.imageUrl} alt="Post content" className="mt-3 rounded-lg border border-white/10 max-h-96 w-full object-cover" />}
                 <div className="flex items-center space-x-6 mt-4 text-gray-400">
                    <button className="flex items-center space-x-2 hover:text-red-500 transition-colors">
                        <HeartIcon className="h-5 w-5" /> <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 hover:text-blue-400 transition-colors">
                        <MessageCircleIcon className="h-5 w-5" /> <span>{post.comments}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
);

const AIAssistant: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [ideas, setIdeas] = useState<{ title: string; description: string }[]>([]);

    const handleGenerateIdeas = async () => {
        setIsLoading(true);
        setIdeas([]);
        const prompt = "You are a strategic content advisor for elite online creators on a premium platform. Generate 5 unique and high-value content ideas. The ideas should focus on monetization, exclusive content, and building a premium brand. Present them as a simple list with a title for each idea, separated by a newline. Example format: 1. Idea Title: Idea description.";
        const result = await generateGeminiContent(prompt);

        if (result && !result.startsWith("Error:")) {
            const formattedIdeas = result.split('\n').filter(idea => idea.trim() !== "").map(idea => {
                const [title, ...description] = idea.replace(/^\d\.\s*/, '').split(':');
                return { title: title.trim(), description: description.join(':').trim() };
            });
            setIdeas(formattedIdeas);
        } else {
             setIdeas([{ title: "Error", description: "Could not generate ideas at this time." }]);
        }
        setIsLoading(false);
    };

    return (
        <div className="bg-black/50 border border-white/10 rounded-lg p-4">
            <h4 className="font-bold text-white mb-2 flex items-center"><SparklesIcon className="h-5 w-5 mr-2 text-purple-400"/> AI Assistant</h4>
            <p className="text-xs text-gray-400 mb-4">Stuck in a creative rut? Get fresh ideas instantly.</p>
            <button
                onClick={handleGenerateIdeas}
                disabled={isLoading}
                className="w-full bg-purple-600/50 hover:bg-purple-600/80 disabled:opacity-50 disabled:cursor-wait text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
            >
                {isLoading ? 'Generating...' : 'Generate Post Ideas ✨'}
            </button>
             {ideas.length > 0 && (
                <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
                    {ideas.map((idea, index) => (
                        <div key={index}>
                            <p className="font-bold text-purple-300 text-sm">{idea.title}</p>
                            <p className="text-xs text-gray-400">{idea.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


// --- CONTENT VIEWS FOR NAVIGATION ---
interface HomeFeedProps {
    user: User;
    feedItems: Post[];
    onPost: (newPost: Post) => void;
}

const HomeFeed: React.FC<HomeFeedProps> = ({ user, feedItems, onPost }) => (
    <div className="max-w-2xl mx-auto">
        <header className="flex justify-between items-center mb-8">
            <div>
                <h2 className="text-3xl font-bold text-white">Home Feed</h2>
                <p className="text-gray-400">Welcome back, {user.name.split(' ')[0]}</p>
            </div>
            <div className="flex items-center space-x-4">
                <button className="relative p-2 hover:bg-white/10 rounded-full">
                    <BellIcon className="h-6 w-6 text-gray-300"/>
                    <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-gray-900"></span>
                </button>
                <button className="p-2 hover:bg-white/10 rounded-full">
                    <SettingsIcon className="h-6 w-6 text-gray-300"/>
                </button>
            </div>
        </header>
        
        <section className="mb-8">
            <CreatePost user={user} onPost={onPost} />
        </section>
        
        <section>
            <h3 className="text-xl font-bold text-white mb-4">Your Content</h3>
            <div className="space-y-4">
               {feedItems.map((item) => (
                    <FeedPost key={item.id} post={item} />
               ))}
            </div>
        </section>
    </div>
);

interface PlaceholderViewProps {
    title: string;
    description: string;
    // FIX: Typed `icon` prop with `React.ReactElement<IconProps>` to fix cloneElement error.
    icon: React.ReactElement<IconProps>;
}

const PlaceholderView: React.FC<PlaceholderViewProps> = ({ title, description, icon }) => (
    <div className="max-w-2xl mx-auto text-center flex flex-col items-center justify-center h-full">
        <div className="text-purple-400 mb-4">
            {React.cloneElement(icon, { className: "h-16 w-16" })}
        </div>
        <h2 className="text-4xl font-bold text-white">{title}</h2>
        <p className="text-gray-400 mt-4 max-w-md">{description}</p>
        <div className="mt-8 p-8 bg-black/50 border border-dashed border-white/10 rounded-xl w-full">
            <p className="text-gray-500">Full component to be built out in a future step.</p>
        </div>
    </div>
);

const AnalyticsView = () => <PlaceholderView title="Analytics" description="Track your growth, revenue, and engagement with detailed charts and reports." icon={<BarChartIcon />} />;
const ContentView = () => <PlaceholderView title="Content Management" description="Organize, schedule, and manage all your exclusive content from one place." icon={<FileTextIcon />} />;
const MonetizationView = () => <PlaceholderView title="Monetization Tools" description="Manage your subscriptions, products, and pricing tiers to maximize your revenue." icon={<DollarSignIcon />} />;


// --- MAIN DASHBOARD SCREEN ---
interface DashboardScreenProps {
    onLogout: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onLogout }) => {
    const [activeView, setActiveView] = useState('Home');
    const [user] = useState<User>({
        name: 'Alex Stanton',
        handle: '@alexstanton',
        avatarUrl: `https://placehold.co/100x100/8A2BE2/FFFFFF?text=A`,
    });

    const [stats] = useState<Stat[]>([
        { label: 'Revenue (30d)', value: '$7,849', change: '+12.5%' },
        { label: 'New Subscribers', value: '102', change: '+8.2%' },
        { label: 'Engagement', value: '72%', change: '-1.4%' },
    ]);

    const [feedItems, setFeedItems] = useState<Post[]>([
        { 
            id: 1,
            user: { name: 'Alex Stanton', handle: '@alexstanton', avatarUrl: `https://placehold.co/100x100/8A2BE2/FFFFFF?text=A` },
            time: '2h ago',
            text: 'Just dropped a new tutorial on advanced monetization strategies. Exclusive for my CABANA members! Check it out and let me know what you think. 🚀',
            imageUrl: `https://placehold.co/600x400/0A0A0A/FFFFFF?text=New+Tutorial+Live!`,
            likes: 132,
            comments: 14,
        },
         { 
            id: 2,
            user: { name: 'Alex Stanton', handle: '@alexstanton', avatarUrl: `https://placehold.co/100x100/8A2BE2/FFFFFF?text=A` },
            time: '1d ago',
            text: 'Behind the scenes from today\'s shoot. It was a long day, but so worth it. More content coming soon!',
            imageUrl: `https://placehold.co/600x400/0A0A0A/FFFFFF?text=Behind+The+Scenes`,
            likes: 256,
            comments: 29,
        },
    ]);
    
    const handlePost = (newPost: Post) => {
        setFeedItems(prevItems => [newPost, ...prevItems]);
    };

    const quickLinks = [
        { title: "Creator Platform", icon: <LayoutDashboardIcon className="h-6 w-6 text-purple-400" /> },
        { title: "Community Portal", icon: <UsersIcon className="h-6 w-6 text-blue-400" /> },
        { title: "Analytics Suite", icon: <BarChartIcon className="h-6 w-6 text-green-400" /> },
        { title: "Support Center", icon: <LifeBuoyIcon className="h-6 w-6 text-yellow-400" /> },
    ];

    const navItems = [
        { name: 'Home', icon: <HomeIcon /> },
        { name: 'Analytics', icon: <BarChartIcon /> },
        { name: 'Content', icon: <FileTextIcon /> },
        { name: 'Monetization', icon: <DollarSignIcon /> },
    ];

    const renderView = () => {
        switch (activeView) {
            case 'Analytics': return <AnalyticsView />;
            case 'Content': return <ContentView />;
            case 'Monetization': return <MonetizationView />;
            case 'Home': default: return <HomeFeed user={user} feedItems={feedItems} onPost={handlePost} />;
        }
    };

    return (
        <div className="min-h-screen bg-dots-pattern text-gray-300 flex">
            <aside className="w-20 lg:w-64 bg-black/30 border-r border-white/10 p-4 flex flex-col">
                <h1 className="text-2xl font-bold tracking-tight iridescent-text bg-clip-text text-transparent mb-12 hidden lg:block">
                    CABANA
                </h1>
                 <div className="w-10 h-10 rounded-full iridescent-bg flex items-center justify-center lg:hidden mb-12">
                     <span className="font-bold text-xl text-black">C</span>
                </div>

                <nav className="flex flex-col space-y-2">
                    {navItems.map(item => (
                        <button 
                            key={item.name}
                            onClick={() => setActiveView(item.name)}
                            className={`flex items-center p-3 rounded-lg transition-colors group w-full ${activeView === item.name ? 'bg-white/10 text-white font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            {React.cloneElement(item.icon, { className: `h-6 w-6 ${activeView === item.name ? 'text-white' : 'text-gray-400 group-hover:text-white'}`})}
                            <span className="ml-4 hidden lg:block">{item.name}</span>
                        </button>
                    ))}
                </nav>

                <div className="mt-auto">
                    <button onClick={onLogout} className="group w-full flex items-center p-3 hover:bg-white/5 rounded-lg transition-colors">
                        <LogOutIcon className="h-6 w-6 text-gray-400 group-hover:text-red-400" />
                        <span className="ml-4 hidden lg:block">Logout</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
                {renderView()}
            </main>

            <aside className="w-80 bg-black/30 border-l border-white/10 p-6 hidden xl:block space-y-8">
                <div className="text-center">
                    <img src={user.avatarUrl} alt="User Avatar" className="w-24 h-24 rounded-full mx-auto border-2 border-purple-500" />
                    <h3 className="text-xl font-bold text-white mt-4">{user.name}</h3>
                    <p className="text-sm text-gray-400">{user.handle}</p>
                </div>
                
                 <div>
                      <h4 className="font-bold text-white mb-2 px-2">Key Metrics</h4>
                        <div className="grid grid-cols-3 gap-2 text-center">
                            {stats.map(stat => (
                                <div key={stat.label} className="bg-black/50 border border-white/10 rounded-lg p-2">
                                    <p className="text-xs text-gray-400">{stat.label.split(' ')[0]}</p>
                                    <p className="text-lg font-bold text-white">{stat.value}</p>
                                </div>
                            ))}
                        </div>
                 </div>

                <AIAssistant />

                <div className="space-y-2">
                    <h4 className="font-bold text-white mb-2 px-2">Quick Links</h4>
                     {quickLinks.map(link => (
                         <a href="#" key={link.title} className="group flex items-center p-3 hover:bg-white/5 rounded-lg transition-colors">
                            {link.icon}
                             <span className="ml-4 text-sm font-medium">{link.title}</span>
                         </a>
                     ))}
                </div>
            </aside>
        </div>
    );
};

export default DashboardScreen;
