/**
 * @fileoverview
 * Provides interactions for all pages in the UI.
 *
 * @author 
 */

/** namespace. */
var rh = rh || {};

/** globals */
rh.COLLECTION_FAMILY_MEMBERS = "FamilyMembers";
rh.KEY_NAME = "name";
rh.KEY_IMAGE_URL = "imageUrl";
rh.KEY_CREATED = "created";
rh.fbFamilyMemberManager = null;

rh.FamilyMember = class {
	constructor(id, name, imageUrl) {
        this.id = id;
		this.name = name;
		this.imageUrl = imageUrl;
	}
}

rh.FbFamilyMemberManager = class {
    constructor() {
        this._documents = [];
        this._unsubscribe = null;
        this._ref = firebase.firestore().collection(rh.COLLECTION_FAMILY_MEMBERS);
    }

    get length() {
        return this._documents.length;
    }

    getFamilyMemberAtIndex(index) {
        return new rh.FamilyMember(
			this._documents[index].id,
			this._documents[index].get(rh.KEY_NAME),
			this._documents[index].get(rh.KEY_IMAGE_URL)
		)
    }

    beginListening(changeListener) {
        console.log("Listening for Family Members");
        this._unsubscribe = this._ref.orderBy(rh.KEY_CREATED).onSnapshot((querySnapshot) => {
            this._documents = querySnapshot.docs;
            console.log("Updated " + this._documents.length + " family members.");
            if (changeListener) {
                changeListener();
            }
        });
    }

    stopListening() {
        this._unsubscribe();
    }

    add(name, imageUrl) {
        this._ref.add({
                [rh.KEY_NAME]: name,
				[rh.KEY_IMAGE_URL]: imageUrl,
				[rh.KEY_CREATED]: firebase.firestore.Timestamp.now()
            })
            .then(function (docRef) {
                console.log("Document added with ID: ", docRef.id);
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });
    }

    delete(id) {
        this._ref.doc(id).delete();
    }
};

rh.ListPageController = class {
    constructor() {
        rh.fbFamilyMemberManager.beginListening(this.updateView.bind(this));
        $("#submit").click(() => {
            const name = $("#nameInput").val();
            const imageUrl = $("#pictureInput").val();
            rh.fbFamilyMemberManager.add(name, imageUrl);
            $("#nameInput").val("");
			$('#pictureInput').prop('selectedIndex',0);
        });
    }

    updateView() {
        console.log("Update the family on the page.");
        $("#familyList").removeAttr("id").hide();
        let $familyList = $(`<div id="familyList" class="row justify-content-center">`);
        for (let k = 0; k < rh.fbFamilyMemberManager.length; k++) {
			const familyMember = rh.fbFamilyMemberManager.getFamilyMemberAtIndex(k);
            const $newCard = $(`
				<div class="col-3 col-md-2">
				<img src="${familyMember.imageUrl}" class="img-fluid" alt="${familyMember.name}">
				<div class="text-center">${familyMember.name}</div>
				</div>
            `);
            $newCard.click((event) => {
                console.log("Delete " + familyMember.id);
                rh.fbFamilyMemberManager.delete(familyMember.id);
            })
            $familyList.append($newCard);
        }
        $("#familyListContainer").append($familyList);
    }
};

/* Main */
$(document).ready(function () {
    if ($("#main-page").length) {
        console.log("On the main page");
        rh.fbFamilyMemberManager = new rh.FbFamilyMemberManager();
        new rh.ListPageController();
    }

});

