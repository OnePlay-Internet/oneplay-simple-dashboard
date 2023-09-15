export default function FAQS() {
    return(
        <>
            <div className="container customH1" id="FAQs">
            <div className="row padding100 justify-content-center">
                <div className="col-12 col-lg-11 text-center mb-4 mb-md-5">
                    <h1 className="text-white font50 font800" data-i18n-key="browseFAQ">
                        Browse FAQs
                    </h1>
                </div>
                <div className="col-lg-11">
                    <div className="customAccordion accordion" id="accordionExample">
                        <div className="accordion-item bgTransparent border-0">
                            <h2 className="accordion-header bgTransparent" id="headingOne">
                                <button data-i18n-key="question1" className="accordion-button font20Text text-white removeButtonFocus bgTransparent font600 ps-0 pe-0 borderBottomCustom customBorder" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    What is Cloud Gaming?
                                </button>
                            </h2>
                            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                <div className="accordion-body ps-0 pe-0 pt-0">
                                    <div className="row">
                                        <div className="col-lg-10">
                                            <p className="font20Text font500 offWhiteColor border-bttom">
                                                Cloud gaming, also known as gaming on-demand or game streaming, refers to a type of gaming where the processing power and rendering of games are handled by remote servers in the cloud instead of on the user's local device. It allows players to stream and play games directly over the internet without the need for powerful hardware or game installations.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="gradientBorderbottom mt-2"></div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item bgTransparent border-0">
                            <h2 className="accordion-header bgTransparent" id="headingTwo">
                                <button data-i18n-key="question2" className="accordion-button collapsed font20Text text-white removeButtonFocus bgTransparent font600 ps-0 pe-0 borderBottomCustom customBorder" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                    What is OnePlay?
                                </button>
                            </h2>
                            <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                <div className="accordion-body ps-0 pe-0 pt-0">
                                    <div className="row">
                                        <div className="col-lg-10">
                                            <p className="font20Text font500 offWhiteColor border-bttom">
                                                OnePlay is a cloud gaming company that specializes in providing cloud gaming services to users. With a robust infrastructure of remote servers, OnePlay enables gamers to access and play a wide variety of games without the need for powerful hardware or game installations. By leveraging their cloud technology, OnePlay allows users to stream games directly over the internet, offering a seamless and convenient gaming experience.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="gradientBorderbottom mt-2"></div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item bgTransparent border-0">
                            <h2 className="accordion-header bgTransparent" id="headingThree">
                                <button className="accordion-button collapsed font20Text text-white removeButtonFocus bgTransparent font600 ps-0 pe-0 borderBottomCustom customBorder" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                    What are the advantages of cloud gaming?
                                </button>
                            </h2>
                            <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                <div className="accordion-body ps-0 pe-0 pt-0">
                                    <div className="row">
                                        <div className="col-lg-10">
                                            <p className="font20Text font500 offWhiteColor border-bttom">
                                                Cloud gaming provides several advantages, including accessibility across multiple devices without the need for powerful hardware, instant play without downloads or installations, a wide variety of games in the platform's library, potential cost savings, and game preservation. However, it requires a stable internet connection and may have subscription costs or limited game availability.
                                                <span data-i18n-key="ansquestion3">Here is what you get while using OnePlay:</span>
                                                <ul className="font20Text font500 offWhiteColor">
                                                    <li data-i18n-key="ansquestion3-1">You can play PC games like GTA 5, Witcher 3, Counter-Strike and Fortnite on Android!</li>
                                                    <li data-i18n-key="ansquestion3-2">You can play your favorite games using OnePlay anywhere you want. On the way by bus, at school or work and during a business trip. You have your gaming PC in your pocket everywhere.</li>
                                                    <li data-i18n-key="ansquestion3-3">You don’t have to download, install or update any game. OnePlay is all you need!</li>
                                                </ul>
                                            </p>
                                            <p className="font20Text font500 offWhiteColor border-bttom">
                                                <span data-i18n-key="ansquestion3-4">Moreover:</span>
                                                <ul className="font20Text font500 offWhiteColor">
                                                    <li data-i18n-key="ansquestion3-5">Disc space is no longer your concern! Some games could take over 50GB of disc capacity, and now OnePlay takes care of storage of those monsters!</li>
                                                    <li data-i18n-key="ansquestion3-6">You get access to your games via many devices and platforms including Android, MacOS, Windows and Xbox.</li>
                                                </ul>
                                            </p>
                                            <p className="font20Text font500 offWhiteColor border-bttom" data-i18n-key="ansquestion3-7">
                                                OnePlay works on almost every device, even those substantially old.
                                            </p> 
                                        </div>
                                    </div>
                                    <div className="gradientBorderbottom mt-2"></div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item bgTransparent border-0">
                            <h2 className="accordion-header bgTransparent" id="headingFour">
                                <button data-i18n-key="question4" className="accordion-button collapsed font20Text text-white removeButtonFocus bgTransparent font600 ps-0 pe-0 borderBottomCustom customBorder" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                    Where are your servers located?
                                </button>
                            </h2>
                            <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                                <div className="accordion-body ps-0 pe-0 pt-0">
                                    <div className="row">
                                        <div className="col-lg-10">
                                            <p className="font20Text font500 offWhiteColor border-bttom">
                                                Our servers are located in Mumbai and we have partnered with other network providers too.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="gradientBorderbottom mt-2"></div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item bgTransparent border-0">
                            <h2 className="accordion-header bgTransparent" id="headingFive">
                                <button data-i18n-key="question5" className="accordion-button collapsed font20Text text-white removeButtonFocus bgTransparent font600 ps-0 pe-0 borderBottomCustom customBorder" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                                    What are the minimum requirements for OnePlay?
                                </button>
                            </h2>
                            <div id="collapseFive" className="accordion-collapse collapse" aria-labelledby="headingFive" data-bs-parent="#accordionExample">
                                <div className="accordion-body ps-0 pe-0 pt-0">
                                    <div className="row">
                                        <div className="col-lg-10">
                                            <p className="font20Text font500 offWhiteColor border-bttom">
                                                To ensure a smooth and immersive gaming experience on OnePlay, it is important to meet the following internet connection requirements. For streaming games in 720p at 60 frames per second (FPS), a minimum internet speed of 15Mbps is necessary. If you prefer a higher resolution gaming experience, such as 1080p at 60 FPS, a minimum internet speed of 25Mbps is required. It is recommended to close any additional tabs or applications that may overload your bandwidth and affect the performance.
                                                <span data-i18n-key="ansquestion5-1">Internet connection requirements</span>
                                                <ul className="font20Text font500 offWhiteColor">
                                                    <li data-i18n-key="ansquestion5-2">OnePlay requires at least 15Mbps for 720p at 60 FPS and 25Mbps for 1080p at 60 FPS.</li>
                                                    <li data-i18n-key="ansquestion5-3">Make sure your bandwidth is not overloaded by other tabs or applications. For the best performance, close additional tabs in your browser and programs that may affect your Internet connection (like YouTube, twitter etc.)</li>
                                                </ul> 
                                            </p>
                                            <p className="font20Text font500 offWhiteColor border-bttom">
                                                <span data-i18n-key="ansquestion5-4">System requirements</span>
                                                <ul className="font20Text font500 offWhiteColor gradientAnchor">
                                                    <li>Please <a href="./download.html#Devices" className="text-decoration-none">click here </a>to read the system requirements for your device.</li>
                                                </ul>
                                            </p> 
                                        </div>
                                    </div>
                                    <div className="gradientBorderbottom mt-2"></div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item bgTransparent border-0">
                            <h2 className="accordion-header bgTransparent" id="ageLimit">
                                <button className="accordion-button collapsed font20Text text-white removeButtonFocus bgTransparent font600 ps-0 pe-0 borderBottomCustom customBorder" type="button" data-bs-toggle="collapse" data-bs-target="#agelimit" aria-expanded="false" aria-controls="agelimit">
                                    Is there any age limit for Registration? 
                                </button>
                            </h2>
                            <div id="agelimit" className="accordion-collapse collapse" aria-labelledby="ageLimit" data-bs-parent="#accordionExample">
                                <div className="accordion-body ps-0 pe-0 pt-0">
                                    <div className="row">
                                        <div className="col-lg-10">
                                            <p className="font20Text font500 offWhiteColor border-bttom">
                                                OnePlay cloud gaming has an minimum requirement of 13 years, making it suitable for gamers of different age groups and ensuring a broad audience can access and enjoy their gaming services.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="gradientBorderbottom mt-2"></div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item bgTransparent border-0">
                            <h2 className="accordion-header bgTransparent" id="headingSix">
                                <button data-i18n-key="question6" className="accordion-button collapsed font20Text text-white removeButtonFocus bgTransparent font600 ps-0 pe-0 borderBottomCustom customBorder" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix">
                                    What games are available at OnePlay?
                                </button>
                            </h2>
                            <div id="collapseSix" className="accordion-collapse collapse" aria-labelledby="headingSix" data-bs-parent="#accordionExample">
                                <div className="accordion-body ps-0 pe-0 pt-0">
                                    <div className="row">
                                        <div className="col-lg-10">
                                            <p className="font20Text font500 offWhiteColor border-bttom">
                                                OnePlay's cloud gaming platform offers an extensive collection of the latest and popular gaming titles. With a diverse range of cutting-edge games, users can immerse themselves in an exciting and up-to-date gaming experience. OnePlay continuously updates its game library to ensure that gamers have access to a comprehensive selection of highly sought-after games.
                                            </p>
                                            <p className="font20Text font500 offWhiteColor border-bttom" data-i18n-key="ansquestion6-2">
                                                On our platform you will find games such as Fortnite, Destiny 2, Mount and Blade II: Bannerlord, Resident Evil 3, Albion Online, Neverwinter, Witcher 3, CS:GO, GTA V, Dead by Daylight, League of Legends,Team Fortress 2, Fallout 4, Path of Exile, Shadow of Tomb Raider, Cuisine Royale, Monster Hunter: World, World of Tanks, Dota 2, Paladins and MORE!
                                            </p> 
                                        </div>
                                    </div>
                                    <div className="gradientBorderbottom mt-2"></div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item bgTransparent border-0">
                            <h2 className="accordion-header bgTransparent" id="headingEight">
                                <button data-i18n-key="question8" className="accordion-button collapsed font20Text text-white removeButtonFocus bgTransparent font600 ps-0 pe-0 borderBottomCustom customBorder" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEight" aria-expanded="false" aria-controls="collapseEight">
                                    How often does OnePlay add games?
                                </button>
                            </h2>
                            <div id="collapseEight" className="accordion-collapse collapse" aria-labelledby="headingEight" data-bs-parent="#accordionExample">
                                <div className="accordion-body ps-0 pe-0 pt-0">
                                    <div className="row">
                                        <div className="col-lg-9">
                                            <p className="font20Text font500 offWhiteColor border-bttom">
                                                OnePlay continually expands its gaming library by adding new games every week. This frequent addition of games ensures that users have a constant influx of fresh and exciting titles to explore and play. With regular updates, OnePlay strives to keep the gaming experience dynamic and engaging for its users.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="gradientBorderbottom mt-2"></div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item bgTransparent border-0">
                            <h2 className="accordion-header bgTransparent" id="playGames">
                                <button className="accordion-button collapsed font20Text text-white removeButtonFocus bgTransparent font600 ps-0 pe-0 borderBottomCustom customBorder" type="button" data-bs-toggle="collapse" data-bs-target="#playgames" aria-expanded="false" aria-controls="playgames">
                                    How can I Play Games? 
                                </button>
                            </h2>
                            <div id="playgames" className="accordion-collapse collapse" aria-labelledby="playGames" data-bs-parent="#accordionExample">
                                <div className="accordion-body ps-0 pe-0 pt-0">
                                    <div className="row">
                                        <div className="col-lg-9">
                                            <p className="font20Text font500 offWhiteColor border-bttom">
                                                To play a game on OnePlay, simply navigate to the games section and click on the "play" button next to the desired game. It's as simple as that! OnePlay aims to provide a seamless and user-friendly experience, allowing gamers to quickly and effortlessly start playing their chosen games with just a few clicks.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="gradientBorderbottom mt-2"></div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item bgTransparent border-0">
                            <h2 className="accordion-header bgTransparent" id="headingSeven">
                                <button data-i18n-key="question7" className="accordion-button collapsed font20Text text-white removeButtonFocus bgTransparent font600 ps-0 pe-0 borderBottomCustom customBorder" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSeven" aria-expanded="false" aria-controls="collapseSeven">
                                    How can I save my in-game progress?
                                </button>
                            </h2>
                            <div id="collapseSeven" className="accordion-collapse collapse" aria-labelledby="headingSeven" data-bs-parent="#accordionExample">
                                <div className="accordion-body ps-0 pe-0 pt-0">
                                    <div className="row">
                                        <div className="col-lg-10">
                                            <p className="font20Text font500 offWhiteColor border-bttom">
                                                Video games with cloud save support utilize the cloud storage of digital distribution platforms like Steam, Epic, or Origin to save your progress securely.
                                            </p>
                                            <p className="font20Text font500 offWhiteColor border-bttom">
                                                OnePlay's Game Data Storage:
                                            </p>
                                            <p className="font20Text font500 offWhiteColor border-bttom">
                                                For games without cloud storage support, OnePlay saves and restores your game data at the beginning of each session. Correctly quitting the game is not necessary in this case if the game creates files during gameplay.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="gradientBorderbottom mt-2"></div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item bgTransparent border-0">
                            <h2 className="accordion-header bgTransparent" id="subscriptionFree">
                                <button className="accordion-button collapsed font20Text text-white removeButtonFocus bgTransparent font600 ps-0 pe-0 borderBottomCustom customBorder" type="button" data-bs-toggle="collapse" data-bs-target="#subscriptionfree" aria-expanded="false" aria-controls="subscriptionfree">
                                    Do I need subscription for Free Games?
                                </button>
                            </h2>
                            <div id="subscriptionfree" className="accordion-collapse collapse" aria-labelledby="subscriptionFree" data-bs-parent="#accordionExample">
                                <div className="accordion-body ps-0 pe-0 pt-0">
                                    <div className="row">
                                        <div className="col-lg-10">
                                            <p className="font20Text font500 offWhiteColor border-bttom">
                                                Yes, a OnePlay subscription is still required to access and play free games. Although these games are provided by stores and don’t need a purchase.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="gradientBorderbottom mt-2"></div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item bgTransparent border-0">
                            <h2 className="accordion-header bgTransparent" id="playMobile">
                                <button className="accordion-button collapsed font20Text text-white removeButtonFocus bgTransparent font600 ps-0 pe-0 borderBottomCustom customBorder" type="button" data-bs-toggle="collapse" data-bs-target="#playmobile" aria-expanded="false" aria-controls="playmobile">
                                    How do I play on mobile? 
                                </button>
                            </h2>
                            <div id="playmobile" className="accordion-collapse collapse" aria-labelledby="playMobile" data-bs-parent="#accordionExample">
                                <div className="accordion-body ps-0 pe-0 pt-0">
                                    <div className="row">
                                        <div className="col-lg-10">
                                            <p className="font20Text font500 offWhiteColor border-bttom">
                                                To enjoy cloud gaming on your mobile device, simply download the OnePlay app from the Play Store. Once installed, you can access a wide selection of games and enjoy the benefits of cloud gaming directly on your mobile device. With the OnePlay app, you can easily stream and play games without the need for powerful hardware, bringing a convenient and immersive gaming experience to your fingertips.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="gradientBorderbottom mt-2"></div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item bgTransparent border-0">
                            <h2 className="accordion-header bgTransparent" id="headingNine">
                                <button data-i18n-key="question9" className="accordion-button collapsed font20Text text-white removeButtonFocus bgTransparent font600 ps-0 pe-0 borderBottomCustom customBorder" type="button" data-bs-toggle="collapse" data-bs-target="#collapseNine" aria-expanded="false" aria-controls="collapseNine">
                                    Do I need to download the games?
                                </button>
                            </h2>
                            <div id="collapseNine" className="accordion-collapse collapse" aria-labelledby="headingNine" data-bs-parent="#accordionExample">
                                <div className="accordion-body ps-0 pe-0 pt-0">
                                    <div className="row">
                                        <div className="col-lg-10">
                                            <p className="font20Text font500 offWhiteColor border-bttom" data-i18n-key="ansquestion9-1">
                                                With OnePlay, our games are streamed directly to you, making a OnePlay subscription incredibly valuable. Our dedicated app allows you to access our game library on any device without the need to download or install games. Simply click and play!
                                            </p>
                                            <p className="font20Text font500 offWhiteColor border-bttom" data-i18n-key="ansquestion9-3">
                                                Once you have installed the OnePlay app, there is no requirement for additional disk space. Your saved games are securely stored in the cloud, accessible from any device by logging into the app. This seamless experience ensures that you can enjoy your favorite games hassle-free, anytime and anywhere.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="gradientBorderbottom mt-2"></div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item bgTransparent border-0">
                            <h2 className="accordion-header bgTransparent" id="heading12">
                                <button className="accordion-button collapsed font20Text text-white removeButtonFocus bgTransparent font600 ps-0 pe-0 borderBottomCustom customBorder" type="button" data-bs-toggle="collapse" data-bs-target="#collapse12" aria-expanded="false" aria-controls="collapse12">
                                    Does OnePlay give Store Credentials?
                                </button>
                            </h2>
                            <div id="collapse12" className="accordion-collapse collapse" aria-labelledby="heading12" data-bs-parent="#accordionExample">
                                <div className="accordion-body ps-0 pe-0 pt-0">
                                    <div className="row">
                                        <div className="col-lg-10">
                                            <p className="font20Text font500 offWhiteColor border-bttom">
                                                OnePlay does not provide store credentials for platforms such as Steam, Epic, Ubisoft, Origin, or battle.net. We recommend that you already have an existing account with these platforms and own the games you wish to play before logging into our platform.
                                            </p>
                                            <p className="font20Text font500 offWhiteColor border-bttom">
                                                By having your own accounts and games on these platforms, you can seamlessly log in to our platform and access your desired games without any additional steps or purchases.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="gradientBorderbottom mt-2"></div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item bgTransparent border-0">
                            <h2 className="accordion-header bgTransparent" id="storeCredentials">
                                <button className="accordion-button collapsed font20Text text-white removeButtonFocus bgTransparent font600 ps-0 pe-0 borderBottomCustom customBorder" type="button" data-bs-toggle="collapse" data-bs-target="#storecredentials" aria-expanded="false" aria-controls="storecredentials">
                                    Do you keep my store credentials?
                                </button>
                            </h2>
                            <div id="storecredentials" className="accordion-collapse collapse" aria-labelledby="storeCredentials" data-bs-parent="#accordionExample">
                                <div className="accordion-body ps-0 pe-0 pt-0">
                                    <div className="row">
                                        <div className="col-lg-10">
                                            <p className="font20Text font500 offWhiteColor border-bttom">
                                                OnePlay implements an auto-login feature that securely stores your login credentials on their servers. This implementation is designed to prioritize the safety and security of your information within the server environment. You can trust that your login details are protected and handled with care while using OnePlay's platform.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="gradientBorderbottom mt-2"></div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item bgTransparent border-0">
                            <h2 className="accordion-header bgTransparent" id="deleteStoreCredentials">
                                <button className="accordion-button collapsed font20Text text-white removeButtonFocus bgTransparent font600 ps-0 pe-0 borderBottomCustom customBorder" type="button" data-bs-toggle="collapse" data-bs-target="#deletestorecredentials" aria-expanded="false" aria-controls="deletestorecredentials">
                                    How Can I delete my saved store credentials?
                                </button>
                            </h2>
                            <div id="deletestorecredentials" className="accordion-collapse collapse" aria-labelledby="deleteStoreCredentials" data-bs-parent="#accordionExample">
                                <div className="accordion-body ps-0 pe-0 pt-0">
                                    <div className="row">
                                        <div className="col-lg-10">
                                            <p className="font20Text font500 offWhiteColor border-bttom">
                                                To delete your store credentials in OnePlay cloud gaming, follow these steps:
                                                <ul className="font20Text font500 offWhiteColor">
                                                    <li>Access your account settings or preferences. You can usually find this option under the profile or settings menu.</li>
                                                    <li>Within this section, locate the option labeled "delete session data" or a similar phrase.</li>
                                                    <li>Click on the "delete session data" option. You may receive a confirmation message to ensure your intent.</li>
                                                    <li>Confirm the deletion to proceed. This action will remove your stored login information and any associated session data.</li>
                                                    <li>After the deletion, your OnePlay cloud gaming experience will start fresh, requiring you to log in again with your credentials.</li>
                                                </ul>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="gradientBorderbottom mt-2"></div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item bgTransparent border-0">
                            <h2 className="accordion-header bgTransparent" id="limitGameplay">
                                <button className="accordion-button collapsed font20Text text-white removeButtonFocus bgTransparent font600 ps-0 pe-0 borderBottomCustom customBorder" type="button" data-bs-toggle="collapse" data-bs-target="#limitgameplay" aria-expanded="false" aria-controls="limitgameplay">
                                    Is there a daily limit for gameplay? 
                                </button>
                            </h2>
                            <div id="limitgameplay" className="accordion-collapse collapse" aria-labelledby="limitGameplay" data-bs-parent="#accordionExample">
                                <div className="accordion-body ps-0 pe-0 pt-0">
                                    <div className="row">
                                        <div className="col-lg-10">
                                            <p className="font20Text font500 offWhiteColor border-bttom">
                                                In OnePlay cloud gaming, there is a daily limit of 4 hours for gameplay. This limit ensures that users have a balanced gaming experience and helps prevent excessive screen time. Once you reach the 4-hour threshold, the platform will prompt a notification or take measures to notify you that your gaming session for the day has ended.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="gradientBorderbottom mt-2"></div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item bgTransparent border-0">
                            <h2 className="accordion-header bgTransparent" id="serverNotAvailable">
                                <button className="accordion-button collapsed font20Text text-white removeButtonFocus bgTransparent font600 ps-0 pe-0 borderBottomCustom customBorder" type="button" data-bs-toggle="collapse" data-bs-target="#servernotavailable" aria-expanded="false" aria-controls="servernotavailable">
                                    What happens if the server or resource is not available?
                                </button>
                            </h2>
                            <div id="servernotavailable" className="accordion-collapse collapse" aria-labelledby="serverNotAvailable" data-bs-parent="#accordionExample">
                                <div className="accordion-body ps-0 pe-0 pt-0">
                                    <div className="row">
                                        <div className="col-lg-10">
                                            <p className="font20Text font500 offWhiteColor border-bttom">
                                                When encountering no resource/server available error, it indicates that the gaming rigs are currently at capacity. However, rest assured that you will still be able to access a gaming rig soon. OnePlay has implemented a new queue feature that provides real-time information about your position in the queue.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="gradientBorderbottom mt-2"></div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item bgTransparent border-0">
                            <h2 className="accordion-header bgTransparent" id="supportOneplay">
                                <button className="accordion-button collapsed font20Text text-white removeButtonFocus bgTransparent font600 ps-0 pe-0 borderBottomCustom customBorder" type="button" data-bs-toggle="collapse" data-bs-target="#supportoneplay" aria-expanded="false" aria-controls="supportoneplay">
                                    Is Multi-player supported on OnePlay? 
                                </button>
                            </h2>
                            <div id="supportoneplay" className="accordion-collapse collapse" aria-labelledby="supportOneplay" data-bs-parent="#accordionExample">
                                <div className="accordion-body ps-0 pe-0 pt-0">
                                    <div className="row">
                                        <div className="col-lg-10">
                                            <p className="font20Text font500 offWhiteColor border-bttom">
                                                If the game you are playing on OnePlay supports multiplayer functionality, you can enjoy multiplayer gameplay. OnePlay enables you to engage in multiplayer sessions, connecting you with other players to enhance your gaming experience.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="gradientBorderbottom mt-2"></div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item bgTransparent border-0">
                            <h2 className="accordion-header bgTransparent" id="multipleDevices">
                                <button className="accordion-button collapsed font20Text text-white removeButtonFocus bgTransparent font600 ps-0 pe-0 borderBottomCustom customBorder" type="button" data-bs-toggle="collapse" data-bs-target="#multipledevices" aria-expanded="false" aria-controls="multipledevices">
                                    Can I use my credentials on multiple devices? 
                                </button>
                            </h2>
                            <div id="multipledevices" className="accordion-collapse collapse" aria-labelledby="multipleDevices" data-bs-parent="#accordionExample">
                                <div className="accordion-body ps-0 pe-0 pt-0">
                                    <div className="row">
                                        <div className="col-lg-10">
                                            <p className="font20Text font500 offWhiteColor border-bttom">
                                                Yes, in OnePlay, you have the flexibility to use your credentials on multiple devices. This means that you can access and enjoy your gaming library and progress across different devices without any limitations. Whether you prefer playing on a desktop computer, laptop, tablet, smart TV, or even a mobile device, you can seamlessly log in to OnePlay and continue your gaming experience across your preferred devices.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="gradientBorderbottom mt-2"></div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item bgTransparent border-0">
                            <h2 className="accordion-header bgTransparent" id="sameCredentials">
                                <button className="accordion-button collapsed font20Text text-white removeButtonFocus bgTransparent font600 ps-0 pe-0 borderBottomCustom customBorder" type="button" data-bs-toggle="collapse" data-bs-target="#samecredentials" aria-expanded="false" aria-controls="samecredentials">
                                    Can I resume game from another device with same credentials?
                                </button>
                            </h2>
                            <div id="samecredentials" className="accordion-collapse collapse" aria-labelledby="sameCredentials" data-bs-parent="#accordionExample">
                                <div className="accordion-body ps-0 pe-0 pt-0">
                                    <div className="row">
                                        <div className="col-lg-10">
                                            <p className="font20Text font500 offWhiteColor border-bttom">
                                                Yes, with OnePlay, you can resume your game from another device using the same credentials. However, it is important to terminate the game properly on the device you were playing before switching to a new device.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="gradientBorderbottom mt-2"></div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item bgTransparent border-0">
                            <h2 className="accordion-header bgTransparent" id="availableOnTv">
                                <button className="accordion-button collapsed font20Text text-white removeButtonFocus bgTransparent font600 ps-0 pe-0 borderBottomCustom customBorder" type="button" data-bs-toggle="collapse" data-bs-target="#availableontv" aria-expanded="false" aria-controls="availableontv">
                                    Is OnePlay available on TV?
                                </button>
                            </h2>
                            <div id="availableontv" className="accordion-collapse collapse" aria-labelledby="availableOnTv" data-bs-parent="#accordionExample">
                                <div className="accordion-body ps-0 pe-0 pt-0">
                                    <div className="row">
                                        <div className="col-lg-10">
                                            <p className="font20Text font500 offWhiteColor border-bttom">
                                                OnePlay is set to expand its reach and will soon be available on TV. This upcoming development means that you will have the opportunity to enjoy your favorite games on a larger screen, right from the comfort of your living room.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="gradientBorderbottom mt-2"></div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item bgTransparent border-0">
                            <h2 className="accordion-header bgTransparent" id="nativeApplications">
                                <button className="accordion-button collapsed font20Text text-white removeButtonFocus bgTransparent font600 ps-0 pe-0 borderBottomCustom customBorder" type="button" data-bs-toggle="collapse" data-bs-target="#nativeapplications" aria-expanded="false" aria-controls="nativeapplications">
                                    Does OnePlay has native applications for Windows and Mac? 
                                </button>
                            </h2>
                            <div id="nativeapplications" className="accordion-collapse collapse" aria-labelledby="nativeApplications" data-bs-parent="#accordionExample">
                                <div className="accordion-body ps-0 pe-0 pt-0">
                                    <div className="row">
                                        <div className="col-lg-10">
                                            <p className="font20Text font500 offWhiteColor border-bttom">
                                                Currently, OnePlay does not have native apps available for Windows and Mac platforms. However, we do offer a native gaming client that provides a dedicated and optimized environment for accessing and playing games on your Windows or Mac computer.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="gradientBorderbottom mt-2"></div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item bgTransparent border-0">
                            <h2 className="accordion-header bgTransparent" id="iosDevices">
                                <button className="accordion-button collapsed font20Text text-white removeButtonFocus bgTransparent font600 ps-0 pe-0 borderBottomCustom customBorder" type="button" data-bs-toggle="collapse" data-bs-target="#iosdevices" aria-expanded="false" aria-controls="iosdevices">
                                    Will Oneplay work on iOS devices? 
                                </button>
                            </h2>
                            <div id="iosdevices" className="accordion-collapse collapse" aria-labelledby="iosDevices" data-bs-parent="#accordionExample">
                                <div className="accordion-body ps-0 pe-0 pt-0">
                                    <div className="row">
                                        <div className="col-lg-10">
                                            <p className="font20Text font500 offWhiteColor border-bttom">
                                                Due to Apple's restrictions on gaming apps, OnePlay is not available as a standalone gaming app on iOS devices. However you can still access OnePlay on their iOS devices by utilizing the mobile web version. By accessing OnePlay through a browser on their iOS device, you can enjoy gaming on the platform.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="gradientBorderbottom mt-2"></div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item bgTransparent border-0">
                            <h2 className="accordion-header bgTransparent" id="autoRenewed">
                                <button className="accordion-button collapsed font20Text text-white removeButtonFocus bgTransparent font600 ps-0 pe-0 borderBottomCustom customBorder" type="button" data-bs-toggle="collapse" data-bs-target="#autorenewed" aria-expanded="false" aria-controls="autorenewed">
                                    Will my monthly subscription gets auto-renewed? 
                                </button>
                            </h2>
                            <div id="autorenewed" className="accordion-collapse collapse" aria-labelledby="autoRenewed" data-bs-parent="#accordionExample">
                                <div className="accordion-body ps-0 pe-0 pt-0">
                                    <div className="row">
                                        <div className="col-lg-10">
                                            <p className="font20Text font500 offWhiteColor border-bttom">
                                                At present, OnePlay does not offer an auto-renewal feature. However, we understand the importance of such functionality and are actively working on implementing it in the near future. In the meantime, we have a straightforward process in place to ensure that you can easily manage your pack subscriptions. You can always purchase future plans for taking the experience to the next level. Furthermore, we provide top-up options to enhance your experience and meet your evolving needs.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="gradientBorderbottom mt-2"></div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item bgTransparent border-0">
                            <h2 className="accordion-header bgTransparent" id="multipleSubscription">
                                <button className="accordion-button collapsed font20Text text-white removeButtonFocus bgTransparent font600 ps-0 pe-0 borderBottomCustom customBorder" type="button" data-bs-toggle="collapse" data-bs-target="#multiplesubscription" aria-expanded="false" aria-controls="multiplesubscription">
                                    Is there a restriction on buying multiple subscription packs? 
                                </button>
                            </h2>
                            <div id="multiplesubscription" className="accordion-collapse collapse" aria-labelledby="multipleSubscription" data-bs-parent="#accordionExample">
                                <div className="accordion-body ps-0 pe-0 pt-0">
                                    <div className="row">
                                        <div className="col-lg-10">
                                            <p className="font20Text font500 offWhiteColor border-bttom">
                                                There are no restrictions on purchasing subscription plans on OnePlay. If you choose a monthly plan, it will start once your current subscription period ends, ensuring a seamless transition. On the other hand, the hourly plan starts immediately upon purchase, allowing you to begin enjoying the benefits of OnePlay without any delay.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="gradientBorderbottom mt-2"></div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item bgTransparent border-0">
                            <h2 className="accordion-header bgTransparent" id="heading14">
                                <button data-i18n-key="question4" className="accordion-button collapsed font20Text text-white removeButtonFocus bgTransparent font600 ps-0 pe-0 borderBottomCustom customBorder" type="button" data-bs-toggle="collapse" data-bs-target="#collapse14" aria-expanded="false" aria-controls="collapse14">
                                    How do I Claim my refund? 
                                </button>
                            </h2>
                            <div id="collapse14" className="accordion-collapse collapse" aria-labelledby="heading14" data-bs-parent="#accordionExample">
                                <div className="accordion-body ps-0 pe-0 pt-0">
                                    <div className="row">
                                        <div className="col-lg-10">
                                            <p className="font20Text font500 offWhiteColor border-bttom">
                                                When it comes to an Active Monthly Plan on OnePlay, it's important to note the refund policy. OnePlay offers a refund option within 24 hours from the completion of the payment transaction, provided no gaming hours have been utilized during this period. However, once this 24-hour window has passed, you will not be eligible for a refund of a purchased subscription. OnePlay also allows customers to apply for a cancel/refund for an upcoming monthly plan. If you have a subscription plan with OnePlay and you wish to cancel it, you can do so up to 5 days prior to the start date of the next billing cycle.
                                            </p>
                                            <p className="font20Text font500 offWhiteColor border-bttom gradientAnchor">
                                                For hourly plans on OnePlay, it's important to note that there is no option available for cancellation and refund. For seeking cancellation and/or refund, please reach out to us at <a href="mailto:support@oneplay.in">support@oneplay.in</a>.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="gradientBorderbottom mt-2"></div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item bgTransparent border-0">
                            <h2 className="accordion-header bgTransparent" id="heading15">
                                <button data-i18n-key="question5" className="accordion-button collapsed font20Text text-white removeButtonFocus bgTransparent font600 ps-0 pe-0 customBorder" type="button" data-bs-toggle="collapse" data-bs-target="#collapse15" aria-expanded="false" aria-controls="collapse15">
                                    How can I cancel my subscription?
                                </button>
                            </h2>
                            <div id="collapse15" className="accordion-collapse collapse" aria-labelledby="heading15" data-bs-parent="#accordionExample">
                                <div className="accordion-body ps-0 pe-0 pt-0">
                                    <div className="row">
                                        <div className="col-lg-10">
                                            <p className="font20Text font500 offWhiteColor border-bttom">
                                                To cancel your OnePlay subscription, please refrain from renewing your plan before the current subscription period ends. Once the billed date is reached, the plan will be automatically cancelled.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="gradientBorderbottom mt-2"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}