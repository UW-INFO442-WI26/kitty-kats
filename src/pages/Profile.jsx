
function Profile() {
    //hardcode now, change with firestore dabatabase
    const moduleProgress = [
        { id: 1, title: 'Module 1', progress: 100, score: 92,  badge: '🏆' },
        { id: 2, title: 'Module 2', progress: 60,  score: null, badge: '📚' },
        { id: 3, title: 'Module 3', progress: 0,   score: null, badge: '🔒' },
        { id: 4, title: 'Module 4', progress: 0,   score: null, badge: '🔒' },
        { id: 5, title: 'Module 5', progress: 0,   score: null, badge: '🔒' },
        { id: 6, title: 'Module 6', progress: 0,   score: null, badge: '🔒' },
    ];
    let completedCount = 0;
    for (let i = 0; i < moduleProgress.length; i++) {
        if (moduleProgress[i].progress === 100) {
        completedCount = completedCount + 1;
        }
    }
    let totalProgress = 0;
    for (let i = 0; i < moduleProgress.length; i++) {
        totalProgress = totalProgress + moduleProgress[i].progress;
    }
    const overallProgress = Math.round(totalProgress / moduleProgress.length);

    return (
      <div className="min-vh-100 bg-gradient-light py-5">
        <div className="container" style={{ maxWidth: '900px' }}>
          <h1 className="text-deep-plum fw-bold">Profile</h1>
        </div>
      </div>
    );
  }
  
  export default Profile;