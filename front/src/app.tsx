import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import './app.css';
import { BehaviorSubject, from, map, Observable, switchMap, tap, take, catchError, EMPTY, skip } from 'rxjs';
import firebaseConfig from './config/firebaseConfig/firebaseConfig.json';
import i18next from 'i18next';
import { I18nextProvider, useTranslation } from 'react-i18next';
import en from "./translations/en.json";
import he from "./translations/he.json";

type pdfData = { [key: string]: string }

type pdfModel<T extends pdfData = pdfData> = { data: T } & {
  language: keyof T,
}
export class FirebaseApi {
  private _firebase: firebase.app.App

  private get firebase(): firebase.app.App {
    return this._firebase || firebase.app()
  }

  private auth: firebase.auth.Auth

  initAuth = () => this.auth = this.firebase.auth()

  logout = (): Observable<void> => !!this.user ? from(this.auth.signOut())?.pipe(() => (this.user = null)) : EMPTY

  signIn = () => from(this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()))?.pipe(
    catchError(err => { console.error(err); return EMPTY }),
    tap(({ user }) => (this.user = user))
  )

  private get username(): string { return this.user?.uid || this.adminUserName }
  private user?: firebase.User
  private adminUserName: string = 'Hyr14QJ2wHPrMPsurzVP5yumse12'
  public pdf?: pdfModel
  public pdfChanged: BehaviorSubject<pdfModel> = new BehaviorSubject<pdfModel>(null)
  public authStateChanged: BehaviorSubject<firebase.User> = new BehaviorSubject<firebase.User>(null)

  constructor() {
    !firebase.apps.length &&
      (this._firebase = firebase.initializeApp(firebaseConfig));
    this.initAuth()
    this.onAuthStateChanged((u) => (this.user = u) || this.authStateChanged?.next(u))
  }

  public get keys(): (keyof pdfModel['data'])[] {
    const keys = Object.keys(this.pdf?.data || {})
    if (Object.keys(this.pdf || {})?.length) {
      return keys as (keyof pdfModel['data'])[]
    }
    return []
  }

  private onAuthStateChanged = (nextOrObserver: | firebase.Observer<any> | ((a: firebase.User | null) => any),
    error?: (a: firebase.auth.Error) => any,
    completed?: firebase.Unsubscribe) => this.auth.onAuthStateChanged(nextOrObserver, error, completed)

  newPdf = (): Observable<pdfModel> =>
    from(this.firebase.database().ref(`CV/${this.username}/`).set({
      language: 'englishFile', data: {
        englishFile: '',
        hebrewFile: '',
        linkedinFileFile: '',
      }
    } as pdfModel))

  updatePdfState = (pdf: pdfModel) => {
    console.log(pdf, 'pdf')
    const handleChanges = (pdf: pdfModel) => {
      this.pdf = pdf;
      this.pdfChanged.next(pdf);
    }
    if (!pdf) {
      const s = this.newPdf()?.pipe(take(1))?.subscribe((pdf) => {
        s?.unsubscribe()
        handleChanges(pdf)
      })
    } else {
      handleChanges(pdf)
    }
  }

  login = () => this.firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())

  getPdf = (): Observable<pdfModel> =>
    from(this.firebase.database().ref(`CV/${this.username}/`).once('value'))?.pipe(map(snap => snap?.val()), tap(this.updatePdfState))

  uploadPdf = (uploadedImage: (Blob | Uint8Array | ArrayBuffer), fileName: string, fileTypeName: keyof pdfModel['data'] = this.pdf?.language): Observable<string> => {
    const storageRef = this.firebase.storage().ref();
    const fileRef = storageRef
      .child(`/CV/${this.username}/${fileName}`);
    return from(fileRef.put(uploadedImage))?.pipe(switchMap(uploadTaskSnapshot => from(uploadTaskSnapshot.ref.getDownloadURL())))?.pipe(
      tap(url => this.updatePdf(
        {
          ...this.pdf,
          data: { ...this.pdf?.data, [fileTypeName]: url },
          language: fileTypeName
        }).toPromise()),
    )
  }

  updatePdf = (upData: Omit<pdfModel, 'data'> & Partial<Pick<pdfModel, 'data'>>): Observable<any> => {
    return from(this.firebase.database().ref(`CV/${this.username}/`).once('value')).pipe(
      switchMap(snap =>
        from(this.firebase.database().ref(`CV/${this.username}`).set({ ...snap.val(), ...upData, data: { ...snap.val()?.data, ...upData?.data } } as pdfModel))?.pipe(
          tap(() => this.updatePdfState({ ...snap.val(), ...upData, data: { ...snap.val()?.data, ...upData?.data } } as pdfModel))
        ))
    )
  }

  deleteFile = (url: string) => from(this.firebase.storage().refFromURL(url)?.delete())

  deletePdf = (deletePdfKey: keyof pdfModel['data']): any => {
    const { pdf: pdfSnapshot } = this
    if (!!deletePdfKey && !!pdfSnapshot?.data?.[deletePdfKey]) {
      this.deleteFile(pdfSnapshot?.data?.[deletePdfKey] || '')
      delete pdfSnapshot?.data?.[deletePdfKey]
      pdfSnapshot.language = Object?.keys(pdfSnapshot?.data || {})?.[0] as keyof pdfModel['data']
      return from(this.firebase.database().ref(`CV/${this.username}`).set(pdfSnapshot as pdfModel))?.pipe(
        tap(() => this.pdf = pdfSnapshot)
      )
    }
  }
}

// enum actionEnum {
//   Delete,
//   Edit
// }

export default function App() {
  const isMobile = (function (a) {
    return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
  })(navigator.userAgent || navigator.vendor || (window as any)?.opera)
  const firebaseApi = new FirebaseApi()
  const defaultFile = 'https://firebasestorage.googleapis.com/v0/b/morbargig-a81d2.appspot.com/o/CV%2Fno-photo-available.png?alt=media&token=27b382af-7a35-4551-ade9-5edb5271df6b'
  const [fileUri, setFileUri] = useState(defaultFile)
  const [cvName, setCvName] = useState('')
  const [t, i18n] = useTranslation('common');
  const setCvNameState = (v: string) => {
    firebaseApi.updatePdf({ language: v })?.toPromise();
    i18n.changeLanguage(v === 'hebrewFile' ? 'he' : 'en');
    setCvName(v)
  }
  useEffect(() => {
    firebaseApi.pdfChanged?.pipe(
      skip(1),
      take(1),
      tap((pdf) => {
        const fileUri = pdf?.data?.[pdf?.language]?.split('&token')?.[0];
        setFileUri(fileUri || defaultFile);
      })
    ).subscribe()
  }, [firebaseApi.pdfChanged])
  useEffect(() => {
    firebaseApi.getPdf()?.pipe(take(1)).toPromise().then(x => setCvName(x.language?.toString()))
  }, [])
  const [isOpen, setIsOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  // const onValueChange = (getValFunc: () => actionEnum) => {
  //   const actionType = getValFunc()
  //   switch (actionType) {
  //     case actionEnum.Delete:
  //       firebaseApi?.deletePdf(cvName)
  //       break;
  //     case actionEnum.Edit:
  //       break;
  //     default:
  //       break;
  //   }
  // }
  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) {
      alert('Please pick a valid image!')
    }
    else {
      const s = firebaseApi.uploadPdf(file, file.name, cvName)?.pipe(take(1))?.subscribe(() => s?.unsubscribe())
    }
  }

  const admin = () => {
    const password = prompt("Please enter your Admin Password", "Password");
    if (password === null || password === "" || password === "Password") {
      return null
    }
    if (password === "bargig123456") {
      setIsEditMode(true)
    }
    if (password !== "bargig123456") {
      alert("Hi your not my Admin, watch out!! ")
    }
  }
  return (<div>
    {isEditMode ? <div>
      <input type="file" onChange={handleImage} />
    </div> : null}
    <div style={{
      display: 'flex',
      // justifyContent: i18n?.language === 'he' ? 'flex-end' : 'flex-start'
      flexDirection: i18n?.language === 'he' ? 'row-reverse' : 'row'
    }} >
      {
        ['englishFile', 'hebrewFile', 'linkedinFile'].map(name => <button key={name} disabled={name === cvName} name={name} onClick={() => setCvNameState(name)}  > {t(`App.Header.Buttons.${name}`)} </button>)
      }
    </div>

    <header>
      <h2 className="header" > {t('App.Header.CvTitle')} </h2>
    </header>

    <div className="topnav">
      <a onClick={() => setIsOpen(!isOpen)} className="active">{t('App.Nav.Menu')}</a>
      {isOpen ?
        <div id="myLinks">
          <a href={fileUri} target="blank">{t('App.Nav.Items.PDF')}</a>
          <a href="https://5d60919cef31b.site123.me/" target="blank">{t('App.Nav.Items.MyWebSite')} </a>
          <a href="https://github.com/morbargig?tab=repositories" target="blank">{t('App.Nav.Items.GitHub')} </a>
          <a href="https://www.linkedinFile.com/in/mor-bargig-744854182/" target="blank">{t('App.Nav.Items.linkedinFile')} </a>
          <a href="tel:+972 52-861-2379" target="blank"> {t('App.Nav.Items.Contact')} </a>
          <a href="mailto:mobargig@gmail.com" target="blank"> {t('App.Nav.Items.Email')} </a>
          <a onClick={admin} className='Admin' >{t('App.Nav.Items.Admin')}</a>
        </div>
        :
        <a
          className="Portfolio"
          href="https://morbargig.github.io/" target="blank" style={{ marginTop: 0 }}>
          {t('App.Nav.Items.Portfolio')} <span></span>
          <img src="https://firebasestorage.googleapis.com/v0/b/morbargig-a81d2.appspot.com/o/morBargigSigLogo.png?alt=media&token=f846b8e6-1096-4675-907d-2f7589ec23e8" alt="Javascript"
            style={{ borderRadius: '50%', height: '12px', width: '12px' }}
          ></img>
        </a>}
    </div>
    {isMobile ?
      <div >
        <iframe title='pdf' id="pdf" name="pdf" src={fileUri} width="100%" height="600px" frameBorder="0" scrolling="yes">
          <p>It appears your web browser doesn't support iframes.</p>
        </iframe>
      </div>
      :
      <div>
        <embed
          id="pdf"
          type="application/pdf"
          src={fileUri}
          width="100%" height="1000px"
          background-color="0xFF525659"
          top-toolbar-height="56"
          full-frame=""
          title="Mor Bargig">
        </embed>
      </div>
    }
  </div>
  );
}

const styles: { [k: string]: React.CSSProperties } = {
  container: {
    flex: 1,
    // width : '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
};


i18next.init({
  interpolation: { escapeValue: false },  // React already does escaping
  lng: 'en',                              // language to use
  resources: {
    en: {
      common: en                           // 'common' is our custom namespace
    },
    he: {
      common: he
    },
  },
});
ReactDOM.render(<React.StrictMode>
  <I18nextProvider i18n={i18next}>
    <App />
  </I18nextProvider>
</React.StrictMode>, document.getElementById('root'));
