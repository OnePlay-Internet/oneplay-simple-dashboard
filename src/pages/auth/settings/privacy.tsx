import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import iconClose from "../../../assets/images/icon-close.svg";
import { useEffect } from "react";
export default function Privacy({ close, focusKey: focusKeyParam }: { close: Function; focusKey: string }) {
  const { focusSelf, focusKey, setFocus } = useFocusable({
    focusable: true,
    trackChildren: true,
    focusKey: focusKeyParam,
    isFocusBoundary: true,
  });
  useEffect(() => {
    setFocus("content-pp");
  }, [setFocus]);
  return (
    <FocusContext.Provider value={focusKeyParam}>
      <div className="settings-popup" tabIndex={-1} style={{ display: "block", opacity: 1, backgroundColor: "#212123" }}>
        
          <FocusableButton focusKeyParam="btn-close-pp" onClick={close}>
            <img src={iconClose} className="img-fluid" alt="" />
          </FocusableButton>
          <FocusableContent focusKeyParam="content-pp">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-12">
                  <h1 className="text-white font50 font800 mt-5">Privacy Policy</h1>
                  <p className="font20Text font500 offWhiteColor mt-4">
                    Last updated: <span className="customOffWhite">02 February 2023</span>
                  </p>

                  <div className="row justify-content-center">
                    <div className="col-lg-12" style={{ textAlign: "left" }}>
                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        When you sign up with OnePlay to utilize our services, we are explicitly or inadvertently bound to come across many
                        details about you as our user. Your data and information is yours and we try our best not to obtain or retain
                        anything which is not required. However, the information which we must nevertheless obtain, collect and/or retain,
                        it is important for us to give full disclosure and obtain active consent for the same from you. OnePlay collects
                        information about you when you create a User Account, Purchase a Subscription, and/or use our Service in general
                        even as a guest, while browsing through our website. Our Privacy Policy applies to all Users who use our Service and
                        pertains to all the data and information, whether it is Sensitive Personal Data/ Information, or, even if it's just
                        Personal Information. However, it is important to understand that the privacy policy and protection under it does
                        not extend to any information which is already within the public domain.
                      </p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        It is further important to note that while this Privacy Policy explicitly covers your interaction with OnePlay and
                        how your data and information is processed and protected by us, you may however connect your account with certain
                        third party websites/apps who may collect your Personal Information themselves independently. Please understand that
                        such collection would be entirely dependent on your agreement with the respective third parties’ Privacy policy.
                        These applications may store your personal information for various legal and business purposes. You may choose to
                        share your Personal Information with them or not. How you interact with any third party is entirely between you and
                        the concerned entity, and is in no way related to our liabilities and responsibilities of data privacy and
                        protection of your OnePlay account you maintain with us. We would request you to ensure that you read their
                        respective privacy policy before interacting with them.
                      </p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        Terms used with a capital letter are defined in our Terms of Use, and we expect you to go through them for better
                        understanding and clarity. Please NOTE usage of any portion of our Website implies your express consent and
                        agreement to this Policy.
                      </p>
                    </div>
                    <div className="col-lg-12" style={{ textAlign: "left" }}>
                      <p className="font20Text font600 text-white mt-4">1.WHO WE ARE</p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        1.1 We are Rainbox Media Pvt. Ltd., a company duly incorporated under the laws India, with its registered office
                        3/B/52, Kalpataru Aura, Opp.R City Mall, LBS Marg, Ghatkopar-W MUMBAI Maharashtra 400086, India. (hereinafter
                        referred to as “OnePlay”).
                      </p>
                    </div>
                    <div className="col-lg-12" style={{ textAlign: "left" }}>
                      <p className="font20Text font600 text-white mt-4">2.WHAT THIS PRIVACY POLICY GOVERNS</p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        2.1 This Privacy Policy applies to www.oneplay.in, your OnePlay user account, and any application, used in
                        concordance with your user account, any games or videos or other content which you use via OnePlay, OnePlay payment
                        methods, the OnePlay web forums, OnePlay customer and technical support and/or any other services we provide to you
                        ("OnePlay services").
                      </p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        2.2 Specifically, this Privacy Policy governs personal information, sensitive personal data/information, and
                        non-personal information which we collect from you when you're using OnePlay services. ("Personal information" means
                        personal data which, on its own or in combination with other information, can be used to identify you and which are
                        necessary to provide the services by OnePlay)
                      </p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        2.3 We respect your right to privacy and will only process personal information in accordance with applicable data
                        protection legislation in your jurisdiction and in our jurisdiction, being India.
                      </p>
                    </div>
                    <div className="col-lg-12" style={{ textAlign: "left" }}>
                      <p className="font20Text font600 text-white mt-4">3.PROTECTING CHILDREN</p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        3.1 We recognise we have a special obligation to protect personal information obtained from children. We do not and
                        would not knowingly collect personal information from any child under the age of 13. If for any reason we decide to
                        collect Personal Information of children between 13 and 18, will we ask for their parent or guardian consent.
                      </p>
                    </div>
                    <div className="col-lg-12" style={{ textAlign: "left" }}>
                      <p className="font20Text font600 text-white mt-4">4.WHAT INFORMATION DO WE COLLECT AND WHY IS IT NEEDED</p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        4.1 When you register a OnePlay account with us, you will need to provide us:
                      </p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        4.1.1 Your username used to identify yourself in any of services provided by us;
                      </p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        4.1.2 Your name, email address, and phone number used to identify yourself in any of services provided by us;
                      </p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        4.1.3 Password (which is encrypted during transmission so that we don’t have access to the phrase itself);
                      </p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        4.1.4 Any other data, which you supply us during the course of utilizing our services;
                      </p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        These sets of information are necessary for us in order to provide you with your OnePlay account requested by you.
                        In your OnePlay profile settings you can also set your password. This information will be protected by your OnePlay
                        account password. You are responsible for keeping it safe.
                      </p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        4.2 When you use OnePlay services we may also collect the following information:
                      </p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        4.2.1 Technical specs and details about devices which you use to access OnePlay services, including: Internet and/or
                        network connection (including your IP address); mobile device identifiers; your operating system, browser type or
                        other software; your hardware details; or other technical details provided by your web browser. This is technical
                        data about our users which help us provide you with a smooth and optimized experience to you as our end user, and
                        helps us in feedback by observing actions and patterns. These information and data do not provide any personal
                        information to us and are not linked or traceable in the nature of being user-specific;
                      </p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        4.2.2 Details of your use of OnePlay services including, but not limited to: metrics information and usage logs
                        about when and how you use OnePlay services (such as what game(s) you are playing, your current status, your
                        interactions with others); traffic data; your geographical location; your purchase history; emails received; and
                        links accessed; your preferences and choices such as subscriptions, preferred language and currency; your
                        communication via chat, game reviews, published posts on forum and other OnePlay Services;
                      </p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        4.2.3 Miscellaneous information required in order to help you with any queries/support you may need assistance with
                        via the OnePlay forums or customer support, including communications with you; ticket numbers or reference numbers,
                        etc.;
                      </p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        4.2.4 Any other information which may be mandated under law to be collected, for the time being in force, or, is
                        mandatory for provision of OnePlay services to you.
                      </p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        While signing up for creating your OnePlay account, you are prompted to provide details on our webform. We have
                        clearly highlighted fields which are mandatory or optional. By proceeding to provide us with this information, you
                        thereby agree with their disclosure and retention by OnePlay. In case you refuse to provide your information, or
                        deny consent for the usage of the information provided, or later withdraw your consent, OnePlay may choose to
                        discontinue or deny the access to features for which the information was collected.
                      </p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        Please note, that any discussions, comments, messages, blogs posts etc. posted by you on the public sections of the
                        apps/website is considered as published content, and is not considered personal information subject to this Privacy
                        Policy. You may request that such information be taken down and, we may attempt to remove any such information if it
                        is technically feasible to do so and as per the applicable laws.
                      </p>
                    </div>
                    <div className="col-lg-12" style={{ textAlign: "left" }}>
                      <p className="font20Text font600 text-white mt-4">5. SHARING, DISCLOSURE AND LIMITATION OF LIABILITY</p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        5.1.1 Mergers or acquisitions: In a scenario where we or our assets are merged or acquired by the other business
                        entity, or during restructuring of business or re-organization, we may have to share information provided by you
                        with the other business entities. Rest assured, if such a transaction occurs the other business entity or the newly
                        combined business entity would be required to follow this Privacy Policy.
                      </p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        5.1.2 Partners: we may engage a number of vendors, consultants, contractors and take support of other companies or
                        affiliates (hereon referred to as our Partners). Our Partners may provide a host of services including contact
                        information verification, payment processing, customer service, website hosting, data analysis, infrastructure
                        provision, IT services, and other similar services. These Partners play a key role in seamless delivery of our
                        products and services to you. These Partners and their employees operate under a contract and strict security &
                        confidentiality restrictions. We may provide our partners access to your information through our systems or may
                        share your Personal Information with them to enable them to provide their services to you. These disclosures will be
                        documented with us and shall be handled with the same level of protection as you might expect from OnePlay.
                      </p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        5.1.3 Customer Initiated Sharing: Whenever you request us to share your information with a third party website or
                        application (for example, login to a third party using your OnePlay ID), we will provide a fresh notice and obtain
                        consent from you regarding the details of the information that will be shared, before sharing the same. In such a
                        case, OnePlay will not be in control of the information (shared with the third party website/application or data
                        generated based on your usage on that website/application) and OnePlay’s privacy policy will not be applicable for
                        any such use, access etc. Any processing, use, sharing of Information provided by you to such third party
                        website/application shall be as per the respective privacy policy of such applications and websites. The customer
                        shall solely be liable to read and provide consent to the third party’s privacy policy before requesting OnePlay to
                        share the information.
                      </p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        5.1.4 Government or judicial process: We may share your Personal Information with the government / government
                        authorities or agencies and legal or judicial authorities for any investigation or to comply with legal process or
                        in response to a request by any of these authorities or to enforce applicable terms and conditions or to protect
                        our, our users and Partners rights, privacy, safety or property.
                      </p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        5.1.5 Legal Reasons: The information provided by you may at times be shared with other entities and affiliates to
                        help in detecting and preventing identity theft, frauds and other illegal activities; correlate or map related
                        accounts to prevent misuse of our products & services and to provide you with the optimum and smooth experience you
                        have signed up for.
                      </p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        5.1.6 Protection of OnePlay: To protect your rights and/or those of our Partners, and to allow OnePlay to pursue
                        available remedies, or limit the damages that it may sustain in case of unauthorized use / misuse of our products or
                        the content thereon, by third parties.
                      </p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        5.2 OnePlay may enter into agreement with third parties to collect, store, process your information or data but
                        under full compliance with applicable laws. These third parties may have their own security standards to safeguard
                        your information or data and we always require such third parties to adopt reasonable security standards to
                        safeguard your information / data on a commercially reasonable basis.
                      </p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        5.3 OnePlay has taken appropriate steps for the security and protection of all our digital platforms including
                        internal applications, however, we do not take any responsibility for any breach of security or the disclosure of
                        Personal Information for reasons outside our control, such as hacking, social engineering, cyber terrorism,
                        espionage by third parties, or any events by way of force majeure such as sabotage, fire, flood, explosion, acts of
                        God, civil commotion, strikes or industrial action of any kind, riots, insurrection, war, acts of government.
                      </p>
                    </div>
                    <div className="col-lg-12" style={{ textAlign: "left" }}>
                      <p className="font20Text font600 text-white mt-4">6. THIRD PARTY WEBSITES, APPLICATIONS AND SERVICES</p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        6.1 OnePlay Portal/website may include links to other websites/applications. Such websites/applications are governed
                        by their respective privacy policies, which are beyond our control. Once you leave our servers (you can tell where
                        you are by checking the URL in the location bar on your browser), use of any information you provide is governed by
                        the privacy policy of the operator of the website/application you are visiting. That policy may differ from ours. If
                        you can't find the privacy policy of any of these websites/applications via a link from the website's homepage, you
                        should contact the website/application directly for more information.
                      </p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        6.2 Whenever you request us to share your information with a third party website or application (for example, login
                        to a third party using your OnePlay ID), we will provide a fresh notice and obtain consent from you regarding the
                        details of the information that will be shared, before sharing the same. In such a case, OnePlay will not be in
                        control of the information (shared with the third party website/application or data generated based on your usage on
                        that website/application) and OnePlay’s privacy policy will not be applicable. The third party website/application
                        will handle the information according to their own privacy policy. The customer shall solely be liable to read and
                        provide consent to the third party’s privacy policy before requesting OnePlay to share the information.
                      </p>
                    </div>
                    <div className="col-lg-12" style={{ textAlign: "left" }}>
                      <p className="font20Text font600 text-white mt-4">7. ACCESS, CORRECTION AND DELETION</p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        7.1 We at OnePlay try on our best effort basis to keep our records updated and accurate with your latest
                        information. You as our end user are responsible to ensure that the information or data you provide from time to
                        time is and shall be correct, current and updated, and, that you have all the rights, permissions and consent to
                        provide such information or data.
                      </p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        7.2 Based on technical feasibility, OnePlay shall attempt to provide you with the access to all your personal and
                        sensitive personal information that we maintain about you as and when you would request for the provision of the
                        same. We will perform verification before providing you access to this information.
                      </p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4 gradientAnchor">
                        7.3 You may request access, correction or updating, and deletion of the information by contacting{" "}
                        <a href="#">grievance@oneplay.in</a>
                      </p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        7.4 You may note that deletion of certain information or withdrawal of consent may lead to cancellation of your
                        registration with us or your access to our App or certain aspects of our App. Additionally, we may not be able to
                        process your request of correction, updating or deletion, in case the same is not supported by valid documents or
                        data retention if required by the applicable law or law enforcement requests or under any judicial proceedings or it
                        is extremely difficult to implement (such as requests related to backup copies or if a new system is required to
                        process the request or change of technical design) or risks the privacy of other users.
                      </p>
                    </div>
                    <div className="col-lg-12" style={{ textAlign: "left" }}>
                      <p className="font20Text font600 text-white mt-4">8. CONTACT DETAILS FOR GRIEVANCE REDRESSAL</p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        8.1 If You have any complaints or concerns with regards to content, or, to report any abuse of applicable laws,
                        breach of Terms of this Application, or, if any content of this Application is in violation of your rights, or the
                        Application is in violation of the Information Technology Act, 2000 ('the IT Act'), and/or the Information
                        Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011
                        ('the SPDI Rules'); then you may immediately contact the Grievance Officer in the following manner.
                      </p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        8.1.1 Sending a request in writing or through email signed with electronic signature identifying the content alleged
                        to be in infringement of your rights as the rightful owner or affecting You prejudicially;
                      </p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        8.1.2 Providing your contact information including email, address, and telephone number where You can be contacted
                        if required.
                      </p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        8.1.3 Giving a declaration cum undertaking along with necessary documents establishing You (i) as the rightful owner
                        of the content to be disabled/ affecting you prejudicially, (ii) as an affected person, stating that the information
                        submitted is true, complete & accurate and no material fact has been hidden, and also stating that OnePlay, its
                        Affiliates, Directors, employees, including Grievance Officer shall not be liable for any loss or damage or claim
                        for relying on such requests.
                      </p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4 gradientAnchor">
                        8.2 You may forward your request/ complaints to the Grievance Officer.
                        <p className="mb-0 font20Text font500 offWhiteColor me-lg-4">
                          Name: <span className="customOffWhite">Nidhi Shah</span>
                        </p>
                        <p className="gradientAnchor font20Text font500 offWhiteColor me-lg-4">
                          Contact : E-mail: <a href="#">grievance@oneplay.in</a>
                        </p>
                      </p>
                    </div>
                    <div className="col-lg-12" style={{ textAlign: "left" }}>
                      <p className="font20Text font600 text-white mt-4">9. REVISION OF PRIVACY POLICY</p>

                      <p className="font20Text font500 offWhiteColor mt-4 me-lg-4">
                        9.1 This privacy policy may be revised from time to time. It is your responsibility as an end user to be aware of
                        your rights and protections promised to you and to keep yourself updated by accessing the revised privacy policy
                        whenever you may have any concern.
                      </p>
                    </div>
                  </div>

                  <p className="font20Text font500 offWhiteColor mt-5 me-lg-4">
                    © OnePlay 2023. Play Any Game on Any Device with OnePlay. Upto Single Digit Latency and 4K 120 FPS on any possible
                    device. Completely Decentralized and Open Source.
                  </p>
                </div>
              </div>
            </div>
          </FocusableContent>
        </div>
    </FocusContext.Provider>
  );
}

const FocusableContent = (props: any) => {
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onArrowPress: (direction, props, details) => {
      if (direction === "left" || direction === "right") {
        setFocus("btn-close-pp");
        return true;
      }
      if (ref.current) {
        const currentTop = ref.current.scrollTop;
        if (direction === "up") {
          if (currentTop === 0) {
            setFocus("btn-close-pp");
          } else {
            ref.current.scrollTop = currentTop - 20;
          }
        } else if (direction === "down") {
          ref.current.scrollTop = currentTop + 20;
        }
      }
      return false;
    },
  });
  return (
    <div ref={ref} className="popup-body text-center p-5">
      {props.children}
    </div>
  );
};
const FocusableButton = (props: any) => {
  const { ref, focused, setFocus } = useFocusable({
    focusable: true,
    focusKey: props.focusKeyParam,
    onEnterPress: () => {
      props.onClick();
    },
    onArrowPress: (direction, aprops, details) => {
      if (direction === "down") {
        setFocus("content-pp");
      }
      return false;
    },
  });
  return (
    <button ref={ref} onClick={props.onClick} className={"setting-popup-close" + (focused ? " focusedElement" : "")}>
      <img src={iconClose} className="img-fluid" alt="" />
    </button>
  );
};
