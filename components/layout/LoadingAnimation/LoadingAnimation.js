import LoadingAnimationStyles from './Loadinganimation.module.css'

export default function LoadingAnimation(){
    return (
        <div className={LoadingAnimationStyles.MainContainer}>
            <div className={LoadingAnimationStyles.LoadingAnimationContainer}>
                <div className={`${LoadingAnimationStyles.LoadingAnimationCircle} ${LoadingAnimationStyles.circle1}`}></div>
                <div className={`${LoadingAnimationStyles.LoadingAnimationCircle} ${LoadingAnimationStyles.circle2}`}></div>
                <div className={`${LoadingAnimationStyles.LoadingAnimationCircle} ${LoadingAnimationStyles.circle3}`}></div>
                <div className={`${LoadingAnimationStyles.LoadingAnimationCircle} ${LoadingAnimationStyles.circle4}`}></div>
            </div>
            <p>Loading</p>
            {(window.location.pathname === "/signup" || window.location.pathname === "/login") && (
                <p style={{fontSize:"16px"}}>Hang on tight! The initial load may take up to 15 seconds!</p>
            )}
        </div>
    )
}