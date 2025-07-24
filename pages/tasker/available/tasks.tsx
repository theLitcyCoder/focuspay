// 'use client';

// import { useEffect, useState } from 'react';
// import { supabase } from '@/lib/supabaseClient';
// import { useRequireRole } from '@/hooks/useProtectedRoute';

// type Task = {
//   campaign_id: string;
//   title: string;
//   url: string;
//   status: string;
//   reward: number;
// };

// export default function AvailableTasks() {
//   const { authorized, checking } = useRequireRole('tasker');
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [overlay, setOverlay] = useState(false);
//   const [countdown, setCountdown] = useState(10);

//   useEffect(() => {
//     if (authorized && !checking) {
//       fetchAvailableTasks();
//     }
//   }, [authorized, checking]);

//   const fetchAvailableTasks = async () => {
//     const { data, error } = await supabase
//       .from('campaigns')
//       .select('*')
//       .eq('status', 'Active');

//     if (error) {
//       console.error('Error fetching tasks:', error.message);
//     } else {
//       setTasks(data);
//     }
//   };

//   // const handleVisitTask = (task: Task) => {
//   //   setOverlay(true);
//   //   setCountdown(10);

//   //   window.open(`/tasker/tasks/${task.campaign_id}`, '_blank');
//   // };

//   const handleVisitTask = async (task: Task) => {
//   // const safeUrl = task.url.startsWith('http') ? task.url : `https://${task.url}`;
//    let safeUrl = task.url;

//   // Ensure the URL starts with http/https
//   if (!/^https?:\/\//i.test(safeUrl)) {
//     safeUrl = 'https://' + safeUrl;
//   }
//   const newTab = window.open(`/tasker/visit/${task.campaign_id}`, '_blank');

//   // const newTab = window.open(safeUrl, '_blank');

//   // const newTab = window.open(task.url, '_blank');

//   if (!newTab) {
//     alert('Popup blocked! Please allow popups for this site.');
//     return;
//   }

  
//   // Log initial closed state for debugging
//   console.log('newTab.closed at start:', newTab.closed);

//   // Wait 100ms before starting countdown to allow tab to open properly
// setTimeout(() => {

//   setOverlay(true);
//   setCountdown(10);

//   let seconds = 10;
//   const countdownInterval = setInterval(async () => {
//     seconds--;
//     setCountdown(seconds);
//     document.title = `⏳ ${seconds}s - FocusPay`;

//     // If tab is closed early
//     // if (seconds < 10 && newTab.closed && seconds > 0) {

//     if (newTab.closed && seconds > 0) {
//       clearInterval(countdownInterval);
//       document.title = '❌ Task Failed';
//       setOverlay(false);
//       alert('You closed the tab too early.');
//     }

//     // Countdown complete
//     // if (seconds <= 0) {
//     //   clearInterval(countdownInterval);

//     //   if (!newTab.closed) newTab.close();
//     //   document.title = '✅ Task Completed';

//     //   markTaskAsViewed(task.campaign_id);
//     //   setOverlay(false);
//     // }
//     if (seconds <= 0) {
//   clearInterval(countdownInterval);

//   if (!newTab.closed) newTab.close();

//   document.title = '✅ Task Completed - FocusPay';
//   await markTaskAsViewed(task.campaign_id); // <-- 🔥 mark as viewed here
//   setOverlay(false);
//     }

//   }, 1000);
// }, 100);
// };


//   // ✅ Listen for completion from child tab
//   useEffect(() => {
//     const handleMessage = (event: MessageEvent) => {
//       if (typeof event.data === 'string' && event.data.startsWith('task-completed:')) {
//         const id = event.data.split(':')[1];
//         console.log(`Task ${id} marked as completed!`);
//         setOverlay(false);
//         document.title = '✅ Task Completed - FocusPay';
//       }
//     };

//     window.addEventListener('message', handleMessage);
//     return () => window.removeEventListener('message', handleMessage);
//   }, []);

//   if (checking) return <p className="p-4">Loading...</p>;

//   return (
//     <div className="dark:bg-gray-950 p-6 text-black dark:text-white min-h-screen">
//       <h1 className="text-2xl font-bold mb-6">Available Tasks</h1>

//       {overlay && (
//         <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col justify-center items-center z-50 text-white">
//           <h1 className="text-2xl font-bold mb-4">Task in progress...</h1>
//           <p className="text-lg mb-2">Do not close the new tab.</p>
//           <p className="text-lg">Waiting for completion...</p>
//         </div>
//       )}

//       {tasks.length === 0 ? (
//         <p>No tasks available right now.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {tasks.map((task) => (
//             <div key={task.campaign_id} className="p-4 border rounded bg-white dark:bg-gray-800">
//               <h2 className="text-lg font-semibold">{task.title}</h2>
//               <p>Reward: ${task.reward}</p>
//               <button
//                 onClick={() => handleVisitTask(task)}
//                 className="text-blue-600 underline mt-2"
//                 disabled={overlay}
//               >
//                 Visit URL
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
// const markTaskAsViewed = async (campaignId: string) => {
//   const {
//     data: { user },
//     error: userError,
//   } = await supabase.auth.getUser();

//   if (userError || !user) {
//     console.error('Error getting user:', userError?.message);
//     return;
//   }

//   const { error } = await supabase.from('tasks_views').insert([
//     {
//       user_id: user.id,
//       campaign_id: campaignId,
//     },
//   ]);

//   if (error) {
//     console.error('Error recording task view:', error.message);
//   } else {
//     console.log(`✅ Task ${campaignId} marked as viewed for user ${user.id}`);
//   }
// };

// 'use client';

// import { useEffect, useState } from 'react';
// import { supabase } from '@/lib/supabaseClient';
// import { useRequireRole } from '@/hooks/useProtectedRoute';
// import { useVisitTask } from '@/hooks/useVisitTask'; // <-- import hook

// type Task = {
//   campaign_id: string;
//   title: string;
//   url: string;
//   status: string;
//   reward: number;
// };

// export default function AvailableTasks() {
//   const { authorized, checking } = useRequireRole('tasker');
//   const [tasks, setTasks] = useState<Task[]>([]);
//     const [profile, setProfile] = useState<any>(null);

//   // const [earnings, setEarnings] = useState(0);
//   // const [overlay, setOverlay] = useState(false);
//   const { visitTask, overlay, countdown } = useVisitTask(); // <-- use hook



//   useEffect(() => {
//     if (authorized && !checking) {
//       fetchAvailableTasks();
//       fetchEarnings();
//     }
//   }, [authorized, checking]);

//   const fetchAvailableTasks = async () => {
//     const { data, error } = await supabase
//       .from('campaigns')
//       .select('*')
//       .eq('status', 'Active');

//     if (error) {
//       console.error('Error fetching tasks:', error.message);
//     } else {
//       setTasks(data);
//     }
//   };

//   const fetchEarnings = async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (!user) return;

//       const { data: profile, error } = await supabase
//         .from('profiles')
//          .select('full_name, email, role, earnings')
//         .eq('id', user.id)
//         .single();
//       if (!error) setProfile(profile);

//       // setEarnings(profile?.earnings || 0);
//     };


//     if (checking) return <p className="p-4">Loading...</p>;
//  return (
//     <div className="dark:bg-gray-950 p-6 text-black dark:text-white min-h-screen">
//       <h1 className="text-2xl font-bold mb-6">Available Tasks</h1>
//          {profile && (
//           <div className="text-right">
//                   <h2 className="text-xl font-bold mb-4">💰 Earnings: ${profile.earnings.toFixed(2)}</h2>

//             <p className="text-lg text-white font-medium">{profile.full_name}</p>
//             <p className="text-sm">{profile.email}</p>
//             <p className="text-sm text-gray-400">{profile.role}</p>
//           </div>
//          )}
//       {overlay && (
//         <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col justify-center items-center z-50 text-white">
//           <h1 className="text-2xl font-bold mb-4">Task in progress...</h1>
//           <p className="text-lg mb-2">Do not close the new tab.</p>
//           <p className="text-lg">Countdown: {countdown}s</p>
//         </div>
//       )}

//       {tasks.length === 0 ? (
//         <p>No tasks available right now.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {tasks.map((task) => (
//             <div
//               key={task.campaign_id}
//               className="p-4 border rounded bg-white dark:bg-gray-800"
//             >
//               <h2 className="text-lg font-semibold">{task.title}</h2>
//               <p>Reward: ${task.reward}</p>
//               <button
//                 onClick={() => visitTask(task)}
//                 className="text-blue-600 underline mt-2"
//                 disabled={overlay}
//               >
//                 Visit URL
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRequireRole } from '@/hooks/useProtectedRoute';
import { useVisitTask } from '@/hooks/useVisitTask';

type Task = {
  campaign_id: string;
  title: string;
  url: string;
  status: string;
  pay_per_click: number;
};

type Profile = {
  full_name: string;
  email: string;
  role: string;
  earnings: number;
};

export default function AvailableTasks() {
  const { authorized, checking } = useRequireRole('tasker');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const { visitTask, overlay, countdown } = useVisitTask();

  useEffect(() => {
    if (!checking && authorized) {
      fetchAvailableTasks();
      fetchProfile();
    }
  }, [checking, authorized]);

  const fetchAvailableTasks = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        console.error('No user found or error getting user:', userError?.message);
        return;
    }

    // 1. Get viewed campaign_ids by user
    const { data: views, error: viewsError } = await supabase
    .from('tasks_views')
    .select('campaign_id')
    .eq('user_id', user.id);

    if (viewsError) {
      console.error('Error fetching task views:', viewsError.message);
      return;
    }

    const viewedCampaignIds = views?.map(v => v.campaign_id) ?? [];


let query = supabase

    .from('links')
    .select('*')
    .eq('status', 'Active');

  if (viewedCampaignIds.length > 0) {
    query = query.not('campaign_id', 'in', viewedCampaignIds);
    console.log('Vyes', viewedCampaignIds);

  }else{
        console.log('no', viewedCampaignIds);

  }

  const { data: links, error: linksError } = await query;

  if (linksError) {
    console.error('Error fetching links:', linksError.message);
    return;
  }
console.log('Links returned:', links);
console.log('Viewed campaigns:', viewedCampaignIds);
  setTasks(links);


// const { data: links, error: linksError } = await supabase      .from('links')
//       .select('*')
//       .eq('status', 'Active')
//       .not('campaign_id', 'in', ['00000000-0000-0000-0000-000000000000']);
// console.log('Viewed campaigns:', viewedCampaignIds);

//   if (linksError) {
//     console.error('Error fetching links:', linksError.message);
//     return;
//   }
  
//   setTasks(links);
    };
 

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('No user found.');
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, email, role, earnings')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error.message);
    } else {
      setProfile(data);
    }
  };

  if (checking) return <p className="p-4">Loading...</p>;

  return (
    <div className="dark:bg-gray-950 p-6 text-black dark:text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Available Tasks</h1>

      {profile && (
        <div className="text-right mb-6">
          <h2 className="text-xl font-bold">💰 Earnings: ${profile.earnings.toFixed(2)}</h2>
          <p className="text-lg font-medium">{profile.full_name}</p>
          <p className="text-sm">{profile.email}</p>
          <p className="text-sm text-gray-400">{profile.role}</p>
        </div>
      )}

      {overlay && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col justify-center items-center z-50 text-white">
          <h1 className="text-2xl font-bold mb-4">Task in progress...</h1>
          <p className="text-lg mb-2">Do not close the new tab.</p>
          <p className="text-lg">Countdown: {countdown}s</p>
        </div>
      )}

      {tasks.length === 0 ? (
        <p>No tasks available right now.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <div
              key={task.campaign_id}
              className="p-4 border rounded bg-white dark:bg-gray-800"
            >
              <h2 className="text-lg font-semibold">{task.title}</h2>
              <p>Reward: ${task.pay_per_click}</p>
              <button
                onClick={() => visitTask(task)}
                className="text-blue-600 underline mt-2"
                disabled={overlay}
              >
                Visit URL
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
