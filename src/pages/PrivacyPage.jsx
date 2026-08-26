import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Users, Mail } from 'lucide-react';

const EFFECTIVE_DATE = 'August 26, 2026';

// Small helpers so the long policy below stays readable and consistently styled.
const Section = ({ title, children }) => (
  <section className="space-y-3">
    <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
      {title}
    </h2>
    <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
      {children}
    </div>
  </section>
);

const SubHeading = ({ children }) => (
  <h3 className="font-heading text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 pt-1">
    {children}
  </h3>
);

const List = ({ items }) => (
  <ul className="list-disc pl-5 space-y-1.5 marker:text-optimist-blue dark:marker:text-amber-400">
    {items.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
);

export const PrivacyPage = () => {
  return (
    <div className="space-y-10 py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Header Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-optimist-gold px-3 py-1 rounded bg-amber-400/20">
          Privacy Policy
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-semibold">
          How We Protect Your Information
        </h1>
        <p className="text-slate-300 text-xs sm:text-base max-w-3xl leading-relaxed">
          The Progressive Optimist Club of Barbados is committed to handling your personal
          information carefully, lawfully and transparently. This policy explains what we collect,
          why we collect it, who it is shared with, and the rights you have over it.
        </p>
        <p className="text-xs text-slate-400">Effective date: {EFFECTIVE_DATE}</p>
      </div>

      {/* At-a-glance */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { icon: ShieldCheck, title: 'We never sell your data', text: 'Your information is never sold, rented or passed to data brokers or marketing lists.' },
          { icon: Users, title: 'Members-only directory', text: 'Your contact details in the directory are visible to active members only, never to the public.' },
          { icon: Lock, title: 'You stay in control', text: 'You can view, correct or ask us to delete your information, and hide your phone number at any time.' }
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
            <Icon className="w-5 h-5 text-optimist-blue dark:text-amber-400" />
            <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white">{title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      <div className="space-y-9">

        <Section title="Scope and Applicability">
          <p>
            This policy applies to all personal information handled by the Progressive Optimist Club
            of Barbados, whether collected through this website, our member portal, membership
            applications, club events, or correspondence with us. It covers members, applicants,
            donors, event participants and visitors to this website.
          </p>
          <p>
            The club is the data controller for this information. We are based in Barbados and this
            policy is written to meet our obligations under the Barbados Data Protection Act, 2019.
          </p>
        </Section>

        <Section title="Legal Basis for Processing">
          <p>We only process personal information where we have a lawful basis to do so:</p>
          <List items={[
            'Consent - where you have clearly agreed to a specific use, such as publishing your photograph. You may withdraw consent at any time.',
            'Contract - where processing is necessary to administer your membership, including dues and member benefits.',
            'Legitimate interests - for running the club, communicating with members, organising events and fundraising, balanced against your privacy.',
            'Legal obligation - where the law, a court order or a regulator requires it.',
            'Vital interests - to protect someone’s life or safety in an emergency.'
          ]} />
        </Section>

        <Section title="Personal Information We Collect">
          <SubHeading>Membership and contact information</SubHeading>
          <List items={[
            'Your name, email address, telephone number and postal address',
            'Your club member ID, role or office held, and membership status',
            'Your profile photograph, if you choose to upload one',
            'Dues records, payment history, balances and treasurer notes',
            'Login credentials, stored only as an encrypted password hash, never in readable form'
          ]} />

          <SubHeading>Content you submit</SubHeading>
          <List items={[
            'Activity posts and project write-ups you publish through the member portal',
            'Photographs you upload to the club gallery, and any captions you add',
            'Messages you send through the contact form on this website'
          ]} />

          <SubHeading>Technical information</SubHeading>
          <List items={[
            'A signed session token, held in your browser, that keeps you logged in',
            'Limited data stored locally in your browser so the site works smoothly between visits',
            'Standard server records generated when a page is requested'
          ]} />

          <p>
            We do not collect health information, biometric data, or any other special category of
            information through this website.
          </p>
        </Section>

        <Section title="The Members Directory">
          <p>
            The member portal includes a directory that helps members reach one another. Please read
            this section carefully, because it is the part of our processing most visible to other
            people.
          </p>
          <List items={[
            'The directory shows your name, club position, email address and mobile telephone number.',
            'It is available only to signed-in, active club members. It is never shown to the public and never appears on the public pages of this website.',
            'Members whose membership ends are removed from the directory.',
            'You may hide your telephone number from the directory at any time, using the setting in My Profile in the member portal. Hidden numbers are not shown and cannot be found through the directory search.',
            'Only mobile numbers are listed. Landline numbers are not displayed.'
          ]} />
          <p>
            You can correct your telephone number, address and profile photograph yourself in My
            Profile. A change to the name held on the club roster is reviewed by a club officer
            before it takes effect.
          </p>
        </Section>

        <Section title="How We Collect Personal Information">
          <SubHeading>Directly from you</SubHeading>
          <List items={[
            'Membership applications and renewals',
            'Details you enter or update in the member portal',
            'Event registrations and attendance records',
            'Messages you send us through the website, by email or by telephone'
          ]} />

          <SubHeading>Automatically</SubHeading>
          <List items={[
            'Session tokens and browser storage needed to keep you signed in',
            'Server records created when this website is used'
          ]} />

          <SubHeading>From others</SubHeading>
          <List items={[
            'Club officers who add or update member records on your behalf',
            'Optimist International and the Optimist Caribbean District, in connection with club membership',
            'A member who refers you for membership'
          ]} />
        </Section>

        <Section title="How We Use Personal Information">
          <List items={[
            'Administering membership applications, approvals and renewals',
            'Maintaining the club roster and the members-only directory',
            'Collecting and recording dues, and issuing member statements',
            'Organising club projects, meetings and community events',
            'Sending members administrative notices and club updates',
            'Publishing club activity and photographs, where consent has been given',
            'Meeting our legal, financial and reporting obligations'
          ]} />
          <SubHeading>What we do not do</SubHeading>
          <List items={[
            'We do not sell, rent or trade personal information.',
            'We do not supply member details to marketing lists, data brokers or people-search services.',
            'We do not make automated decisions that significantly affect anyone.',
            'We do not use personal information for purposes incompatible with why it was collected.'
          ]} />
        </Section>

        <Section title="Sharing and Disclosure">
          <SubHeading>Within the club</SubHeading>
          <p>
            Club officers and committee members may access member records where it is necessary for
            their duties. Treasury records are restricted to those responsible for club finances.
          </p>

          <SubHeading>Service providers</SubHeading>
          <p>
            We rely on a small number of established providers to operate this website. They process
            information on our instructions and are not permitted to use it for their own purposes:
          </p>
          <List items={[
            'Website hosting, which serves this site and its member portal',
            'A managed database service, which stores member, dues and content records',
            'A payment processor, which handles online dues and donations. Card details are entered on the processor’s own systems and are never seen or stored by the club.',
            'An email delivery service, used to send notices such as password links and dues statements',
            'Google Photos, which stores and serves photographs in the club gallery'
          ]} />

          <SubHeading>Other disclosures</SubHeading>
          <List items={[
            'Optimist International and the Optimist Caribbean District, in connection with club membership and reporting',
            'Where disclosure is required by law, a court order or a regulator, or to protect the rights or safety of any person'
          ]} />
        </Section>

        <Section title="International Transfers">
          <p>
            Some of the providers described above operate outside Barbados, which means your
            information may be stored or processed in other countries. Where that happens we take
            reasonable steps to satisfy ourselves that the information remains protected to a
            standard consistent with the Barbados Data Protection Act, 2019, including through the
            contractual terms offered by those providers and their published security practices.
          </p>
        </Section>

        <Section title="Your Rights">
          <p>Under the Barbados Data Protection Act, 2019 you have the right to:</p>
          <List items={[
            'Be informed about how your personal information is used',
            'Request a copy of the personal information we hold about you',
            'Have inaccurate or incomplete information corrected',
            'Request erasure of your information where there is no continuing reason to keep it',
            'Receive your information in a portable, machine-readable form',
            'Object to processing carried out on the basis of our legitimate interests',
            'Request that we restrict processing while a concern is being resolved',
            'Withdraw consent at any time, where consent is what we relied on'
          ]} />
          <p>
            Some of these you can exercise directly: My Profile in the member portal lets you update
            your telephone number, address and photograph, and hide your number from the directory.
            For anything else, get in touch through our{' '}
            <Link to="/contact" className="font-bold text-optimist-blue dark:text-amber-400 hover:underline">
              contact page
            </Link>
            . We aim to respond within 30 days. We may need to confirm your identity first, so that
            we do not disclose your information to someone else.
          </p>
        </Section>

        <Section title="Consent">
          <p>
            Where we rely on consent, it is asked for separately, in plain language, and is never
            bundled into something else. We rely on consent mainly for publishing photographs and
            for optional communications.
          </p>
          <p>
            You can withdraw consent at any time by contacting us, or by using the unsubscribe link
            in any club email. Withdrawing consent does not affect processing already carried out,
            and does not affect records we must keep for membership or legal reasons.
          </p>
        </Section>

        <Section title="Retention">
          <p>
            We keep personal information only as long as it is needed for the purpose it was
            collected for, or as long as the law requires.
          </p>
          <List items={[
            'Member records are kept for the duration of membership and for seven years afterwards, consistent with financial and reporting obligations.',
            'Dues and payment records are kept for seven years.',
            'Applications that are not taken forward are archived and then deleted.',
            'Content published to the website, such as project posts and gallery photographs, is kept until it is removed by the author or a club officer.'
          ]} />
          <p>When information is no longer needed it is securely deleted or anonymised.</p>
        </Section>

        <Section title="Security">
          <List items={[
            'Traffic between your browser and this website is encrypted in transit.',
            'Passwords are stored only as salted hashes and cannot be read by anyone, including club officers.',
            'Access to member records is limited by role, and treasury functions are restricted further.',
            'Signed session tokens are used so that access cannot be gained by altering data held in your browser.',
            'Member contact details and dues figures are withheld from anyone who is not signed in.'
          ]} />
          <p>
            No system can be guaranteed completely secure, but we take these measures seriously and
            review them as the site changes.
          </p>
        </Section>

        <Section title="Cookies and Browser Storage">
          <p>
            This website does not use advertising or third-party tracking cookies, and does not
            build advertising profiles.
          </p>
          <List items={[
            'A signed session token keeps you logged in to the member portal.',
            'Local browser storage holds a small amount of information, such as cached club content, so pages load quickly.'
          ]} />
          <p>
            You can clear this at any time through your browser settings, though doing so will sign
            you out of the member portal.
          </p>
        </Section>

        <Section title="Data Breach Notification">
          <p>
            If a breach of personal information occurs that is likely to result in a risk to
            individuals, we will:
          </p>
          <List items={[
            'Contain and investigate the incident without delay',
            'Notify the Data Protection Commissioner of Barbados in line with the timeframes set out in the Barbados Data Protection Act, 2019',
            'Notify affected individuals directly where the risk to them is high',
            'Record the incident and the steps taken in response'
          ]} />
        </Section>

        <Section title="Children’s Privacy">
          <p>
            The club runs programmes for young people, but this website and its member portal are
            intended for adults. We do not knowingly collect personal information from children
            through this website.
          </p>
          <List items={[
            'Where children take part in club programmes, information is collected through the relevant programme with parental or guardian consent, not through this website.',
            'Photographs of young people are published only with the consent of a parent or guardian.',
            'A parent or guardian may ask to see, correct or delete information held about their child, and may withdraw consent at any time.'
          ]} />
          <p>
            If we learn that a child has provided information through this website, we will delete
            it.
          </p>
        </Section>

        <Section title="Complaints">
          <p>
            If you are concerned about how the club has handled your personal information, please
            raise it with us first through our{' '}
            <Link to="/contact" className="font-bold text-optimist-blue dark:text-amber-400 hover:underline">
              contact page
            </Link>
            . We will acknowledge your complaint, look into it properly, and give you a written
            response.
          </p>
          <p>
            If you are not satisfied with our response, you may complain to the Office of the Data
            Protection Commissioner of Barbados, which is the authority responsible for enforcing
            the Barbados Data Protection Act, 2019.
          </p>
        </Section>

        <Section title="Changes to This Policy">
          <p>
            This policy is reviewed periodically so that it stays accurate and keeps pace with
            changes in the law and in how the website works. Where we make a material change we will
            post a notice on this website and, where appropriate, tell members directly before it
            takes effect.
          </p>
          <p>The effective date at the top of this page shows when it was last updated.</p>
        </Section>

        <Section title="Definitions">
          <List items={[
            'Personal information - information that identifies an individual, or could identify them when combined with other information.',
            'Data controller - the organisation that decides why and how personal information is processed. For the purposes of this policy, that is the Progressive Optimist Club of Barbados.',
            'Data processor - a third party that processes personal information on the controller’s instructions, such as our hosting or payment providers.',
            'Processing - anything done with personal information, including collecting, storing, using, sharing, correcting and deleting it.',
            'Consent - a freely given, specific and informed agreement to a particular use of your information.',
            'Anonymisation - permanently altering information so that an individual can no longer be identified from it.'
          ]} />
        </Section>

        <Section title="Legal Framework">
          <p>
            This policy is written to meet the club’s obligations under the Barbados Data
            Protection Act, 2019, and reflects generally accepted practice for the protection of
            personal information.
          </p>
        </Section>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-optimist-blue dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Questions about this policy, or about the information we hold about you?
            </p>
          </div>
          <Link
            to="/contact"
            className="px-5 py-2.5 rounded-xl bg-optimist-blue hover:bg-blue-800 text-white font-bold text-xs shadow transition-colors text-center shrink-0"
          >
            Contact the Club
          </Link>
        </div>

      </div>
    </div>
  );
};
