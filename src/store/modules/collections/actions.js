import {
  SET_COLLECTIONS,
  ADD_COLLECTION,
  DELETE_COLLECTION,
  UPDATE_COLLECTION,
  ADD_FIELD,
  UPDATE_FIELD,
  UPDATE_FIELDS,
  REMOVE_FIELD
} from "../../mutation-types";
import { i18n, availableLanguages } from "../../../lang/";
import formatTitle from "@directus/format-title";
import _ from "lodash";
import api from "../../../api";

export function addField({ commit }, { collection, field }) {
  commit(ADD_FIELD, { collection, field });
}

export function updateField({ commit }, { collection, field }) {
  commit(UPDATE_FIELD, { collection, field });
}

export function updateFields({ commit }, { collection, updates }) {
  commit(UPDATE_FIELDS, { collection, updates });
}

export function removeField({ commit }, { collection, field }) {
  commit(REMOVE_FIELD, { collection, field });
}

export async function getCollections({ commit }) {
  const collectionsResponse = await api.getCollections();
  const collections = collectionsResponse.data;

  /*
   * We're using vue-i18n to provide the translations for collections / 
   * extensions / fields and all other user generated content as well.
   * In order to make this work, the collection names need to be scoped.
   * The loop below will go over all collections to check if they have a 
   * translation object setup. If so, that's being injected into the vue-i18n 
   * messages so the app can render it based on the current language with the
   * regular $t() function eg $t('collections-about')
   */

  _.forEach(collections, collection => {
    if (_.isEmpty(collection.translation)) {
      // If translations haven't been setup, we're using the title formatter
      _.forEach(availableLanguages, locale => {
        i18n.mergeLocaleMessage(locale, {
          [`collections-${collection.collection}`]: formatTitle(
            collection.collection
          )
        });
      });
    } else {
      _.forEach(collection.translation, (value, locale) => {
        i18n.mergeLocaleMessage(locale, {
          [`collections-${collection.collection}`]: value
        });
      });
    }
  });

  commit(SET_COLLECTIONS, collections);
}

export function addCollection({ commit }, collection) {
  if (!_.isEmpty(collection.translation)) {
    _.forEach(collection.translation, (value, locale) => {
      i18n.mergeLocaleMessage(locale, {
        [`collections-${collection.collection}`]: value
      });
    });
  } else {
    _.forEach(availableLanguages, locale => {
      i18n.mergeLocaleMessage(locale, {
        [`collections-${collection.collection}`]: formatTitle(
          collection.collection
        )
      });
    });
  }
  commit(ADD_COLLECTION, collection);
}

export function removeCollection({ commit }, collection) {
  commit(DELETE_COLLECTION, collection);
}

export function updateCollection({ commit }, { collection, edits }) {
  commit(UPDATE_COLLECTION, { collection, edits });
}
